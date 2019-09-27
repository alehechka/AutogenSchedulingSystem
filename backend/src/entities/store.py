# coding=utf-8

from sqlalchemy import Column, String, Integer, DateTime

from .entity import Entity, Base

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
