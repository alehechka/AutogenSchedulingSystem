# coding=utf-8

from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from .entity import Entity, Base, Session
from flask import Blueprint, jsonify, request
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields

class Position(Entity, Base):
    __tablename__ = 'positions'

    department_id = Column(Integer, ForeignKey('departments.id'))
    name = Column(String)
    description = Column(String, nullable=True)
    expiration_date = Column(Date, nullable=True)

    def __init__(self, department_id, created_by, name, description=None, expiration_date=None):
        Entity.__init__(self, created_by)
        self.department_id = department_id
        self.name = name
        self.description = description
        self.expiration_date = expiration_date


class PositionSchema(Schema):
    id = fields.Number()
    department_id = fields.Number()
    name = fields.Str()
    description = fields.Str()
    expiration_date = fields.DateTime()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('positions', __name__)

@blueprint.route('/get/<department_id>', methods=['GET'])
@requires_auth
def get_positions(department_id):
    # fetching from the database
    session = Session()
    position_object = session.query(Position).filter(Position.department_id == department_id)

    # transforming into JSON-serializable objects
    schema = PositionSchema(many=True)
    positions = schema.dump(position_object)

    # serializing as JSON
    session.close()
    return jsonify(positions)

@blueprint.route('/add', methods=['POST'], endpoint='add_position')
@requires_auth
def add_position():
    # mount store object
    posted_position = PositionSchema(only=('department_id', 'name', 'description', 'expiration_date')) \
        .load(request.get_json())

    position = Position(**posted_position, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(position)
    session.commit()

    # return created store
    new_position = PositionSchema().dump(position)
    session.close()
    return jsonify(new_position), 201

@blueprint.route('/delete/<position_id>', methods=['DELETE'], endpoint='delete_position')
@requires_auth
@requires_role('admin')
def delete_position(position_id):
    session = Session()
    position = session.query(Position).filter_by(id=position_id).first()
    session.delete(position)
    session.commit()
    session.close()
    return '', 201

# @blueprint.route('/delete_all/<department_id>', methods=['DELETE'], endpoint='delete_positions')
# @requires_auth
# @requires_role('admin')
def delete_positions(department_id):
    session = Session()
    session.query(Position).filter_by(department_id=department_id).delete()
    session.commit()
    session.close()
    return '', 201