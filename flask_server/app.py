from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

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

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    new_user = User(
        role=data['role'],
        name=data['name'],
        country=data['country'],
        countrycode=data['countryCode'],
        phone=data['phone'],
        email=data['email'],
        propertyfor=data.get('propertyFor'),
        propertytype=data.get('propertyType'),
        propertysubtype=data.get('propertySubType'),
        propertyage=data.get('propertyAge'),
        bhktype=data.get('bhkType'),
        building=data.get('building'),
        locality=data.get('locality'),
        landmark=data.get('landmark'),
        city=data.get('city'),
        ispetsallowed=data.get('isPetsAllowed'),
        watersupply=data.get('waterSupply'),
        electricity=data.get('electricity'),
        cctv=data.get('cctv'),
        reservedparking=data.get('reservedParking'),
        rent=data.get('rent'),
        security=data.get('security'),
        maintenance=data.get('maintenance'),
        maintenanceprice=data.get('maintenancePrice'),
        maintenancetype=data.get('maintenanceType')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User added successfully'})

@app.route('/update/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.propertyfor = data.get('propertyFor', user.propertyfor)
    user.propertytype = data.get('propertyType', user.propertytype)
    user.propertysubtype = data.get('propertySubType', user.propertysubtype)
    user.propertyage = data.get('propertyAge', user.propertyage)
    user.bhktype = data.get('bhkType', user.bhktype)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/update2/<int:id>', methods=['PUT'])
def update_user2(id):
    data = request.json
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.building = data.get('building', user.building)
    user.locality = data.get('locality', user.locality)
    user.landmark = data.get('landmark', user.landmark)
    user.city = data.get('city', user.city)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/update3/<int:id>', methods=['PUT'])
def update_user3(id):
    data = request.json
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.ispetsallowed = data.get('isPetsAllowed', user.ispetsallowed)
    user.watersupply = data.get('waterSupply', user.watersupply)
    user.electricity = data.get('electricity', user.electricity)
    user.cctv = data.get('cctv', user.cctv)
    user.reservedparking = data.get('reservedParking', user.reservedparking)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/update4/<int:id>', methods=['PUT'])
def update_user4(id):
    data = request.json
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.rent = data.get('rent', user.rent)
    user.security = data.get('security', user.security)
    user.maintenance = data.get('maintenance', user.maintenance)
    user.maintenancetype = data.get('maintenanceType', user.maintenancetype)
    user.maintenanceprice = data.get('maintenancePrice', user.maintenanceprice)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    if users:
        users_data = []
        for user in users:
            user_data = {
                'id': user.id,
                'role': user.role,
                'name': user.name,
                'country': user.country,
                'countrycode': user.countrycode,
                'phone': user.phone,
                'email': user.email,
                'propertyfor': user.propertyfor,
                'propertytype': user.propertytype,
                'propertysubtype': user.propertysubtype,
                'propertyage': user.propertyage,
                'bhktype': user.bhktype,
                'building': user.building,
                'locality': user.locality,
                'landmark': user.landmark,
                'city': user.city,
                'ispetsallowed': user.ispetsallowed,
                'watersupply': user.watersupply,
                'electricity': user.electricity,
                'cctv': user.cctv,
                'reservedparking': user.reservedparking,
                'rent': user.rent,
                'security': user.security,
                'maintenance': user.maintenance,
                'maintenancetype': user.maintenancetype,
                'maintenanceprice': user.maintenanceprice
            }
            users_data.append(user_data)
        return jsonify(users_data)
    else:
        return jsonify({'message': 'No users found'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
