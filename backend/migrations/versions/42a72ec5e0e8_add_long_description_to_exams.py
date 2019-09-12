"""add long_description to exams

Revision ID: 42a72ec5e0e8
Revises: 
Create Date: 2019-09-12 09:32:58.174693

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42a72ec5e0e8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('exams', sa.Column(
        'long_description',
        sa.Text,
        nullable=False,
        server_default='Default exam description'))


def downgrade():
    pass
