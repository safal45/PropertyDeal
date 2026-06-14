import os
import uuid
from datetime import timedelta

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from sqlalchemy.orm import joinedload
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

_allowed_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS(app, origins=_allowed_origins)

# Render and some PaaS providers issue postgres:// URIs; SQLAlchemy 2.x requires postgresql://
_db_url = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
if _db_url.startswith('postgres://'):
    _db_url = 'postgresql://' + _db_url[len('postgres://'):]
app.config['SQLALCHEMY_DATABASE_URI'] = _db_url

_jwt_secret = os.environ.get('JWT_SECRET_KEY')
if not _jwt_secret:
    raise RuntimeError(
        'JWT_SECRET_KEY is required. '
        'Copy flask_server/.env.example to flask_server/.env and set the value, '
        'or run: export JWT_SECRET_KEY=$(openssl rand -hex 32)'
    )
app.config['JWT_SECRET_KEY'] = _jwt_secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(80))
    name = db.Column(db.String(80))
    country = db.Column(db.String(80))
    countrycode = db.Column(db.String(80))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    propertyfor = db.Column(db.String(20))
    propertytype = db.Column(db.String(80))
    propertysubtype = db.Column(db.String(80))
    propertyage = db.Column(db.String(80))
    bhktype = db.Column(db.String(20))
    building = db.Column(db.String(80))
    locality = db.Column(db.String(80))
    landmark = db.Column(db.String(80))
    city = db.Column(db.String(120))
    ispetsallowed = db.Column(db.String(10))
    watersupply = db.Column(db.String(80))
    electricity = db.Column(db.String(80))
    reservedparking = db.Column(db.String(10))
    cctv = db.Column(db.String(10))
    maintenance = db.Column(db.String(120))
    rent = db.Column(db.String(120))
    security = db.Column(db.String(120))
    maintenancetype = db.Column(db.String(120))
    maintenanceprice = db.Column(db.String(120))


# ---------------------------------------------------------------------------
# V2 Models
# ---------------------------------------------------------------------------

def _uuid():
    return str(uuid.uuid4())


class UserAccount(db.Model):
    """Identity table — one row per registered user."""
    __tablename__ = 'users'

    id           = db.Column(db.String(36), primary_key=True, default=_uuid)
    name         = db.Column(db.String(100), nullable=False)
    email        = db.Column(db.String(150), unique=True, nullable=False)
    phone        = db.Column(db.String(20), nullable=True)
    country      = db.Column(db.String(80), nullable=True)
    country_code = db.Column(db.String(10), nullable=True)
    role          = db.Column(db.String(20), nullable=False, default='owner')  # owner | builder | agent
    password_hash = db.Column(db.String(256), nullable=True)
    created_at    = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at    = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    properties = db.relationship('Property', back_populates='owner', cascade='all, delete-orphan')


class Property(db.Model):
    """Core listing record — owned by a UserAccount."""
    __tablename__ = 'properties'

    id               = db.Column(db.String(36), primary_key=True, default=_uuid)
    user_id          = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    status           = db.Column(db.String(20), nullable=False, default='draft')  # draft | published | unpublished
    property_for     = db.Column(db.String(10), nullable=True)   # Rent | Sale
    property_type    = db.Column(db.String(30), nullable=True)   # Residential | Commercial | Land/Plot
    property_subtype = db.Column(db.String(100), nullable=True)
    property_age     = db.Column(db.String(50), nullable=True)
    bhk_type         = db.Column(db.String(20), nullable=True)
    created_at       = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at       = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    owner    = db.relationship('UserAccount', back_populates='properties')
    location = db.relationship('PropertyLocation', back_populates='property', uselist=False, cascade='all, delete-orphan')
    features = db.relationship('PropertyFeatures', back_populates='property', uselist=False, cascade='all, delete-orphan')
    pricing  = db.relationship('PropertyPricing', back_populates='property', uselist=False, cascade='all, delete-orphan')
    images   = db.relationship('PropertyImage', back_populates='property', cascade='all, delete-orphan',
                               order_by='PropertyImage.display_order')


class PropertyLocation(db.Model):
    """One-to-one location detail for a property. Lat/lng populated by geocoder."""
    __tablename__ = 'property_locations'

    id          = db.Column(db.String(36), primary_key=True, default=_uuid)
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id'), nullable=False, unique=True)
    building    = db.Column(db.String(150), nullable=True)
    locality    = db.Column(db.String(150), nullable=True)
    landmark    = db.Column(db.String(150), nullable=True)
    city        = db.Column(db.String(150), nullable=True)
    lat         = db.Column(db.Numeric(9, 6), nullable=True)
    lng         = db.Column(db.Numeric(9, 6), nullable=True)
    created_at  = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at  = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    property = db.relationship('Property', back_populates='location')


class PropertyFeatures(db.Model):
    """One-to-one amenity flags for a property. Booleans replace V1 Yes/No strings."""
    __tablename__ = 'property_features'

    id               = db.Column(db.String(36), primary_key=True, default=_uuid)
    property_id      = db.Column(db.String(36), db.ForeignKey('properties.id'), nullable=False, unique=True)
    is_pets_allowed  = db.Column(db.Boolean, nullable=True)
    water_supply     = db.Column(db.String(80), nullable=True)
    electricity      = db.Column(db.String(80), nullable=True)
    reserved_parking = db.Column(db.Boolean, nullable=True)
    cctv             = db.Column(db.Boolean, nullable=True)
    created_at       = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at       = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    property = db.relationship('Property', back_populates='features')


class PropertyPricing(db.Model):
    """One-to-one pricing for a property. Numeric replaces V1 String money fields."""
    __tablename__ = 'property_pricing'

    id                = db.Column(db.String(36), primary_key=True, default=_uuid)
    property_id       = db.Column(db.String(36), db.ForeignKey('properties.id'), nullable=False, unique=True)
    rent              = db.Column(db.Numeric(12, 2), nullable=True)
    security_deposit  = db.Column(db.Numeric(12, 2), nullable=True)
    maintenance       = db.Column(db.String(30), nullable=True)   # Included in Rent | Extra
    maintenance_price = db.Column(db.Numeric(12, 2), nullable=True)
    maintenance_type  = db.Column(db.String(20), nullable=True)   # Monthly | Annually
    created_at        = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at        = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    property = db.relationship('Property', back_populates='pricing')


class PropertyImage(db.Model):
    """One-to-many images per property. `display_order` controls gallery sequence."""
    __tablename__ = 'property_images'

    id            = db.Column(db.String(36), primary_key=True, default=_uuid)
    property_id   = db.Column(db.String(36), db.ForeignKey('properties.id'), nullable=False)
    url           = db.Column(db.String(500), nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    created_at    = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    property = db.relationship('Property', back_populates='images')


# V1 routes removed (RV3-001) — POST /submit and PUT /update[1-4] were unauthenticated
# and wrote directly to the User table with no validation. V2 replaces this flow.
# GET /users removed (S-001) — exposed full PII unauthenticated.
# Use POST /auth/register + POST /properties + PATCH routes for the V2 listing flow.

# ---------------------------------------------------------------------------
# V2 Routes
# ---------------------------------------------------------------------------

def _get_owned_property(property_id, reject_published=False):
    """Load a property and assert it belongs to the JWT identity.
    Returns (property, None) on success or (None, error_response) on failure.
    Pass reject_published=True to block mutations on published listings (S-011).
    """
    prop = db.session.get(Property, property_id)
    if not prop:
        return None, (jsonify({'error': 'Property not found'}), 404)
    if prop.user_id != get_jwt_identity():
        return None, (jsonify({'error': 'Forbidden'}), 403)
    if reject_published and prop.status == 'published':
        return None, (jsonify({'error': 'Published listings cannot be modified'}), 409)
    return prop, None


# ---------------------------------------------------------------------------
# Input validation helpers (S-004 / S-009)
# ---------------------------------------------------------------------------

def _check_lengths(data, limits):
    """limits: dict of {field_name: max_len}. Returns error response or None."""
    for field, max_len in limits.items():
        val = data.get(field)
        if val is not None and isinstance(val, str) and len(val) > max_len:
            return jsonify({'error': f'{field} exceeds maximum length of {max_len} characters'}), 400
    return None


def _check_numeric(data, fields):
    """fields: list of field names that must be numeric if present. Returns error or None."""
    for field in fields:
        val = data.get(field)
        if val is not None:
            try:
                float(val)
            except (TypeError, ValueError):
                return jsonify({'error': f'{field} must be a number'}), 400
    return None


# -- Auth ------------------------------------------------------------------

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json or {}

    missing = [f for f in ['name', 'email', 'password'] if not data.get(f)]
    if missing:
        return jsonify({'error': f'Missing required fields: {missing}'}), 400

    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    role = data.get('role', 'owner')
    if role not in {'owner', 'builder', 'agent'}:
        return jsonify({'error': 'role must be one of: owner, builder, agent'}), 400

    err = _check_lengths(data, {'name': 100, 'email': 150, 'phone': 20, 'country': 80, 'country_code': 10})
    if err:
        return err

    email = data['email'].strip().lower()
    if UserAccount.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = UserAccount(
        name=data['name'],
        email=email,
        password_hash=generate_password_hash(data['password']),
        phone=data.get('phone'),
        country=data.get('country'),
        country_code=data.get('country_code'),
        role=role,
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json or {}

    missing = [f for f in ['email', 'password'] if not data.get(f)]
    if missing:
        return jsonify({'error': f'Missing required fields: {missing}'}), 400

    email = data['email'].strip().lower()
    user = UserAccount.query.filter_by(email=email).first()
    if not user or not user.password_hash or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200


# -- Properties ------------------------------------------------------------

@app.route('/properties', methods=['POST'])
@jwt_required()
def create_property():
    prop = Property(user_id=get_jwt_identity())
    db.session.add(prop)
    db.session.commit()
    return jsonify({'property_id': prop.id, 'status': prop.status}), 201


@app.route('/properties/<string:property_id>/details', methods=['PATCH'])
@jwt_required()
def update_property_details(property_id):
    prop, err = _get_owned_property(property_id, reject_published=True)
    if err:
        return err

    data = request.json or {}
    err = _check_lengths(data, {
        'property_for': 10, 'property_type': 30,
        'property_subtype': 100, 'property_age': 50, 'bhk_type': 20,
    })
    if err:
        return err

    prop.property_for     = data.get('property_for', prop.property_for)
    prop.property_type    = data.get('property_type', prop.property_type)
    prop.property_subtype = data.get('property_subtype', prop.property_subtype)
    prop.property_age     = data.get('property_age', prop.property_age)
    prop.bhk_type         = data.get('bhk_type', prop.bhk_type)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return jsonify({'message': 'Property details updated'}), 200


@app.route('/properties/<string:property_id>/location', methods=['PATCH'])
@jwt_required()
def update_property_location(property_id):
    prop, err = _get_owned_property(property_id, reject_published=True)
    if err:
        return err

    data = request.json or {}
    err = _check_lengths(data, {
        'building': 150, 'locality': 150, 'landmark': 150, 'city': 150,
    })
    if err:
        return err
    err = _check_numeric(data, ['lat', 'lng'])
    if err:
        return err

    loc = prop.location
    if not loc:
        loc = PropertyLocation(property_id=prop.id)
        db.session.add(loc)

    loc.building = data.get('building', loc.building)
    loc.locality = data.get('locality', loc.locality)
    loc.landmark = data.get('landmark', loc.landmark)
    loc.city     = data.get('city', loc.city)
    loc.lat      = data.get('lat', loc.lat)
    loc.lng      = data.get('lng', loc.lng)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return jsonify({'message': 'Location updated'}), 200


@app.route('/properties/<string:property_id>/features', methods=['PATCH'])
@jwt_required()
def update_property_features(property_id):
    prop, err = _get_owned_property(property_id, reject_published=True)
    if err:
        return err

    data = request.json or {}
    err = _check_lengths(data, {'water_supply': 80, 'electricity': 80})
    if err:
        return err
    feat = prop.features
    if not feat:
        feat = PropertyFeatures(property_id=prop.id)
        db.session.add(feat)

    # Explicit key check for booleans — .get() default would mask False values
    if 'is_pets_allowed' in data:
        feat.is_pets_allowed = data['is_pets_allowed']
    if 'reserved_parking' in data:
        feat.reserved_parking = data['reserved_parking']
    if 'cctv' in data:
        feat.cctv = data['cctv']
    feat.water_supply = data.get('water_supply', feat.water_supply)
    feat.electricity  = data.get('electricity', feat.electricity)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return jsonify({'message': 'Features updated'}), 200


@app.route('/properties/<string:property_id>/pricing', methods=['PATCH'])
@jwt_required()
def update_property_pricing(property_id):
    prop, err = _get_owned_property(property_id, reject_published=True)
    if err:
        return err

    data = request.json or {}
    err = _check_lengths(data, {'maintenance': 30, 'maintenance_type': 20})
    if err:
        return err
    err = _check_numeric(data, ['rent', 'security_deposit', 'maintenance_price'])
    if err:
        return err

    pricing = prop.pricing
    if not pricing:
        pricing = PropertyPricing(property_id=prop.id)
        db.session.add(pricing)

    pricing.rent              = data.get('rent', pricing.rent)
    pricing.security_deposit  = data.get('security_deposit', pricing.security_deposit)
    pricing.maintenance       = data.get('maintenance', pricing.maintenance)
    pricing.maintenance_price = data.get('maintenance_price', pricing.maintenance_price)
    pricing.maintenance_type  = data.get('maintenance_type', pricing.maintenance_type)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return jsonify({'message': 'Pricing updated'}), 200


@app.route('/properties/<string:property_id>/publish', methods=['PATCH'])
@jwt_required()
def publish_property(property_id):
    prop, err = _get_owned_property(property_id)
    if err:
        return err

    if prop.status == 'published':
        return jsonify({'message': 'Already published', 'status': prop.status}), 200

    if not prop.property_for:
        return jsonify({'error': 'property_for is required before publishing'}), 422
    if not prop.pricing or prop.pricing.rent is None:
        return jsonify({'error': 'pricing.rent is required before publishing'}), 422

    prop.status = 'published'

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return jsonify({'message': 'Property published', 'status': prop.status}), 200


@app.route('/properties/<string:property_id>', methods=['GET'])
def get_property(property_id):
    prop = (
        Property.query
        .options(
            joinedload(Property.location),
            joinedload(Property.features),
            joinedload(Property.pricing),
        )
        .filter_by(id=property_id, status='published')
        .first()
    )
    if not prop:
        return jsonify({'error': 'Property not found'}), 404

    loc      = prop.location
    feat     = prop.features
    pricing  = prop.pricing

    return jsonify({
        'id':               prop.id,
        'property_for':     prop.property_for,
        'property_type':    prop.property_type,
        'property_subtype': prop.property_subtype,
        'bhk_type':         prop.bhk_type,
        'property_age':     prop.property_age,
        'created_at':       prop.created_at.isoformat() if prop.created_at else None,
        'location': {
            'building': loc.building if loc else None,
            'locality': loc.locality if loc else None,
            'landmark': loc.landmark if loc else None,
            'city':     loc.city     if loc else None,
            'lat':      float(loc.lat) if loc and loc.lat is not None else None,
            'lng':      float(loc.lng) if loc and loc.lng is not None else None,
        } if loc else None,
        'features': {
            'is_pets_allowed':  feat.is_pets_allowed  if feat else None,
            'water_supply':     feat.water_supply      if feat else None,
            'electricity':      feat.electricity       if feat else None,
            'reserved_parking': feat.reserved_parking  if feat else None,
            'cctv':             feat.cctv              if feat else None,
        } if feat else None,
        'pricing': {
            'rent':              float(pricing.rent)              if pricing and pricing.rent              is not None else None,
            'security_deposit':  float(pricing.security_deposit)  if pricing and pricing.security_deposit  is not None else None,
            'maintenance':       pricing.maintenance              if pricing else None,
            'maintenance_price': float(pricing.maintenance_price) if pricing and pricing.maintenance_price is not None else None,
            'maintenance_type':  pricing.maintenance_type         if pricing else None,
        } if pricing else None,
    }), 200


@app.route('/properties', methods=['GET'])
def list_properties():
    try:
        page  = max(1, int(request.args.get('page', 1)))
        limit = min(100, max(1, int(request.args.get('limit', 20))))
    except (TypeError, ValueError):
        return jsonify({'error': 'page and limit must be integers'}), 400

    # Future filter params (city, property_type, property_for, min_rent, max_rent)
    # are accepted but not yet applied — callers may pass them without errors.
    pagination = (
        Property.query
        .options(
            joinedload(Property.location),
            joinedload(Property.pricing),
        )
        .filter_by(status='published')
        .order_by(Property.created_at.desc())
        .paginate(page=page, per_page=limit, error_out=False)
    )

    def _serialize(prop):
        loc     = prop.location
        pricing = prop.pricing
        return {
            'id':               prop.id,
            'property_for':     prop.property_for,
            'property_type':    prop.property_type,
            'property_subtype': prop.property_subtype,
            'bhk_type':         prop.bhk_type,
            'property_age':     prop.property_age,
            'location': {
                'building': loc.building if loc else None,
                'locality': loc.locality if loc else None,
                'city':     loc.city     if loc else None,
            } if loc else None,
            'pricing': {
                'rent':             float(pricing.rent)            if pricing and pricing.rent            is not None else None,
                'maintenance_type': pricing.maintenance_type       if pricing else None,
            } if pricing else None,
            'created_at': prop.created_at.isoformat() if prop.created_at else None,
        }

    return jsonify({
        'data': [_serialize(p) for p in pagination.items],
        'pagination': {
            'page':     pagination.page,
            'limit':    pagination.per_page,
            'total':    pagination.total,
            'pages':    pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev,
        },
    }), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=os.environ.get('FLASK_DEBUG', '').lower() in ('1', 'true'))
