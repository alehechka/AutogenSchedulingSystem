# coding=utf-8

from sqlalchemy import Column, String, Integer, DateTime
from flask import Blueprint, jsonify, request
from .entity import Entity, Base, Session
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields

class Store(Entity, Base):
    __tablename__ = 'stores'

    street_address = Column(String)
    phone_number = Column(Integer)
    zip_code = Column(Integer)
    name = Column(String)
    description = Column(String)
    state = Column(String)
    city = Column(String)

    def __init__(self, street_address, phone_number, zip_code, name, description, state, city, created_by):
        Entity.__init__(self, created_by)
        self.street_address = street_address
        self.phone_number = phone_number
        self.zip_code = zip_code
        self.name = name
        self.description = description
        self.state = state
        self.city = city

class StoreSchema(Schema):
    id = fields.Number()
    street_address = fields.Str()
    phone_number = fields.Number()
    zip_code = fields.Number()
    name = fields.Str()
    description = fields.Str()
    state = fields.Str()
    city = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('stores', __name__)

@blueprint.route('/get', methods=['GET'])
@requires_auth
def get_stores():
    # fetching from the database
    session = Session()
    store_objects = session.query(Store).all()

    # transforming into JSON-serializable objects
    schema = StoreSchema(many=True)
    stores = schema.dump(store_objects)

    # serializing as JSON
    session.close()
    return jsonify(stores)

@blueprint.route('/getStore/<store_id>', methods=['GET'])
@requires_auth
def get_store(store_id):
    # fetching from the database
    session = Session()
    store_object = session.query(Store).filter_by(id=store_id).first()

    # transforming into JSON-serializable objects
    schema = StoreSchema(many=False)
    store = schema.dump(store_object)

    # serializing as JSON
    session.close()
    return jsonify(store)

@blueprint.route('/add', methods=['POST'], endpoint='add_store')
@requires_auth
@requires_role('admin')
def add_store():
    # mount store object
    posted_store = StoreSchema(only=('street_address', 'phone_number', 'zip_code', 'name', 'description', 'state', 'city')) \
        .load(request.get_json())

    store = Store(**posted_store, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(store)
    session.commit()

    # return created store
    new_store = StoreSchema().dump(store)
    session.close()
    return jsonify(new_store), 201

@blueprint.route('/delete/<store_id>', methods=['DELETE'], endpoint='delete_store')
@requires_auth
@requires_role('admin')
def delete_store(store_id):
    session = Session()
    store = session.query(Store).filter_by(id=store_id).first()
    session.delete(store)
    session.commit()
    session.close()
    return '', 201
