# coding=utf-8

from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from .entity import Entity, Base, Session
from flask import Blueprint, jsonify, request
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields
from .position import Position, delete_positions, PositionSchema, get_internal_positions

class Department(Entity, Base):
    __tablename__ = 'departments'

    store_id = Column(Integer, ForeignKey('stores.id'))
    name = Column(String)
    description = Column(String, nullable=True)
    expiration_date = Column(Date, nullable=True)

    def __init__(self, store_id, created_by, name, description=None, expiration_date=None):
        Entity.__init__(self, created_by)
        self.store_id = store_id
        self.name = name
        self.description = description
        self.expiration_date = expiration_date


class DepartmentSchema(Schema):
    id = fields.Number()
    store_id = fields.Number()
    name = fields.Str()
    description = fields.Str()
    expiration_date = fields.DateTime()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
    positions = fields.List(fields.Nested(PositionSchema))

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('departments', __name__)

@blueprint.route('/get/<store_id>', methods=['GET'])
@requires_auth
def get_departments(store_id):
    # fetching from the database
    session = Session()
    department_object = session.query(Department).filter(Department.store_id == store_id)

    # transforming into JSON-serializable objects
    schema = DepartmentSchema(many=True)
    departments = schema.dump(department_object)

    # serializing as JSON
    session.close()
    return jsonify(departments)

# WIP: For some reason only the last item has it's positions populated.
@blueprint.route('/get_with_positions/<store_id>', methods=['GET'])
@requires_auth
def get_departments_positions(store_id):
    # fetching from the database
    session = Session()
    department_object = session.query(Department).filter(Department.store_id == store_id)

    for department in department_object:
        department.positions = get_internal_positions(department.id)

    # transforming into JSON-serializable objects
    schema = DepartmentSchema(many=True)
    departments = schema.dump(department_object)

    # serializing as JSON
    session.close()
    return jsonify(departments)

@blueprint.route('/add', methods=['POST'], endpoint='add_department')
@requires_auth
def add_department():
    # mount store object
    posted_department = DepartmentSchema(only=('store_id', 'name', 'description', 'expiration_date')) \
        .load(request.get_json())

    department = Department(**posted_department, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(department)
    session.commit()

    # return created store
    new_department = DepartmentSchema().dump(department)
    session.close()
    return jsonify(new_department), 201

@blueprint.route('/update/<department_id>', methods=['POST'], endpoint='update_department')
@requires_auth
def update_department(department_id):
    # mount store object
    posted_department = DepartmentSchema(only=('store_id', 'name', 'description')) \
        .load(request.get_json())

    update = Department(**posted_department, created_by="HTTP post request")

    # persist store
    session = Session()

    department = session.query(Department).filter_by(id=department_id).first()
    department.name = update.name
    department.description = update.description
    department.last_updated_by = "HTTP post request"
    department.updated_at = update.updated_at
    session.commit()

    # return created store
    new_department = DepartmentSchema().dump(department)
    session.close()
    return jsonify(new_department), 201

@blueprint.route('/delete/<department_id>', methods=['DELETE'], endpoint='delete_department')
@requires_auth
@requires_role('admin')
def delete_department(department_id):
    delete_positions(department_id)
    session = Session()
    department = session.query(Department).filter_by(id=department_id).first()
    session.delete(department)
    session.commit()
    session.close()
    return '', 201

def delete_departments(store_id):
    session = Session()
    departments = session.query(Department).filter_by(store_id=store_id)
    for department in departments:
        delete_positions(department.id)
        session.delete(department)
    session.commit()
    session.close()
    return