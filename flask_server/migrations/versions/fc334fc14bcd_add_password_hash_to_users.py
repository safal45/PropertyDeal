"""add password_hash to users

Revision ID: fc334fc14bcd
Revises: ba945510a25c
Create Date: 2026-06-13 19:07:37.113792

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fc334fc14bcd'
down_revision = 'ba945510a25c'
branch_labels = None
depends_on = None


def upgrade():
    # Index drops removed — autogenerate false-positives caused by SQLite index
    # reflection limitations. The 3 indexes (ix_properties_status,
    # ix_properties_user_id, ix_property_locations_city) are alive in the DB
    # from migration ba945510a25c and must not be touched here.
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.String(length=256), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('password_hash')
