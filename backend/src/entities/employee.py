# coding=utf-8

from sqlalchemy import Column, String, Integer, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .entity import Entity, Base
from .store import Store

from marshmallow import Schema, fields

class Employee(Entity, Base):
    __tablename__ = 'employees'

    store_id = Column(Integer, ForeignKey('stores.id'))
    monday_start = Column(Float, nullable=True, default=0)
    monday_end = Column(Float, nullable=True, default=0)
    tuesday_start = Column(Float, nullable=True, default=0)
    tuesday_end = Column(Float, nullable=True, default=0)
    wednesday_start = Column(Float, nullable=True, default=0)
    wednesday_end = Column(Float, nullable=True, default=0)
    thursday_start = Column(Float, nullable=True, default=0)
    thursday_end = Column(Float, nullable=True, default=0)
    friday_start = Column(Float, nullable=True, default=0)
    friday_end = Column(Float, nullable=True, default=0)
    saturday_start = Column(Float, nullable=True, default=0)
    saturday_end = Column(Float, nullable=True, default=0)
    sunday_start = Column(Float, nullable=True, default=0)
    sunday_end = Column(Float, nullable=True, default=0)
    number_of_hours = Column(Float, nullable=False, default=0)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    role = Column(String, nullable=False, server_default='employee')#admin, owner, manager, employee
    auth0_id = Column(String, unique=True)

    def __init__(self, store_id, auth0_id, created_by, end_date=None, role='employee',
                monday_start=0, monday_end=0, 
                tuesday_start=0, tuesday_end=0, 
                wednesday_start=0, wednesday_end=0, 
                thursday_start=0, thursday_end=0, 
                friday_start=0, friday_end=0, 
                saturday_start=0, saturday_end=0, 
                sunday_start=0, sunday_end=0, 
                number_of_hours=0):
        Entity.__init__(self, created_by)
        self.store_id = store_id
        self.monday_start = monday_start
        self.monday_end = monday_end
        self.tuesday_start = tuesday_start
        self.tuesday_end = tuesday_end
        self.wednesday_start = wednesday_start
        self.wednesday_end = wednesday_end
        self.thursday_start = thursday_start
        self.thursday_end = thursday_end
        self.friday_start = friday_start
        self.friday_end = friday_end
        self.saturday_start = saturday_start
        self.saturday_end = saturday_end
        self.sunday_start = sunday_start
        self.sunday_end = sunday_end
        self.number_of_hours = number_of_hours
        self.start_date = datetime.now()
        self.end_date = end_date
        self.role = role
        self.auth0_id = auth0_id

class EmployeeSchema(Schema):
    id = fields.Number()
    store_id = fields.Number()
    monday_start = fields.Number()
    monday_end = fields.Number()
    tuesday_start = fields.Number()
    tuesday_end = fields.Number()
    wednesday_start = fields.Number()
    wednesday_end = fields.Number()
    thursday_start = fields.Number()
    thursday_end = fields.Number()
    friday_start = fields.Number()
    friday_end = fields.Number()
    saturday_start = fields.Number()
    saturday_end = fields.Number()
    sunday_start = fields.Number()
    sunday_end = fields.Number()
    number_of_hours = fields.Number()
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    role = fields.Str()
    auth0_id = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
