"""Adding fields to employees

Revision ID: 0bb82ba977fc
Revises: 62710926f3ac
Create Date: 2020-01-15 17:53:55.688937

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0bb82ba977fc'
down_revision = '62710926f3ac'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('employees', sa.Column(
        'first_name',
        sa.Text,
        nullable=False))
    op.add_column('employees', sa.Column(
        'last_name',
        sa.Text,
        nullable=True))
    op.add_column('employees', sa.Column(
        'email',
        sa.Text,
        nullable=True))
    op.add_column('employees', sa.Column(
        'phone',
        sa.Text,
        nullable=True))
    pass


def downgrade():
    pass
