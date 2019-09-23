"""Updating stores

Revision ID: 62710926f3ac
Revises: 42a72ec5e0e8
Create Date: 2019-09-18 21:43:07.796923

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '62710926f3ac'
down_revision = '42a72ec5e0e8'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('stores', sa.Column(
        'state',
        sa.Text,
        nullable=True))
    op.add_column('stores', sa.Column(
        'city',
        sa.Text,
        nullable=True))


def downgrade():
    pass
