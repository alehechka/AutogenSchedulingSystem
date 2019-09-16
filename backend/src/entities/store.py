# coding=utf-8

from sqlalchemy import Column, String, Integer, DateTime

from .entity import Entity, Base

from marshmallow import Schema, fields

class Store(Entity, Base):
    __tablename__ = 'stores'

    street_address = Column(String)
    phone_number = Column(String)
    zip_code = Column(Integer)
    name = Column(String)
    description = Column(String)
    expiration_date = Column(DateTime)

    def __init__(self, street_address, phone_number, zip_code, name, description, expiration_date):
        Entity.__init__(self, created_by)
        self.street_address = street_address
        self.phone_number = phone_number
        self.zip_code = zip_code
        self.name = name
        self.description = description
        self.expiration_date = expiration_date

class StoreSchema(Schema):
    id = fields.Number()
    street_address = fields.Str()
    phone_number = fields.Str()
    zip_code = fields.Number()
    name = fields.Str()
    description = fields.Str()
    expiration_date = fields.DateTime()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
