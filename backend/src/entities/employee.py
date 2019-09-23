# coding=utf-8

from sqlalchemy import Column, String, Integer, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship

from .entity import Entity, Base
from .store import Store

from marshmallow import Schema, fields

class Employee(Entity, Base):
    __tablename__ = 'employees'

    store_id = Column(Integer, ForeignKey('stores.id'))
    monday_start = Column(Float, nullable=True)
    monday_end = Column(Float, nullable=True)
    tuesday_start = Column(Float, nullable=True)
    tuesday_end = Column(Float, nullable=True)
    wednesday_start = Column(Float, nullable=True)
    wednesday_end = Column(Float, nullable=True)
    thursday_start = Column(Float, nullable=True)
    thursday_end = Column(Float, nullable=True)
    friday_start = Column(Float, nullable=True)
    friday_end = Column(Float, nullable=True)
    saturday_start = Column(Float, nullable=True)
    saturday_end = Column(Float, nullable=True)
    sunday_start = Column(Float, nullable=True)
    sunday_end = Column(Float, nullable=True)
    number_of_hours = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    role = Column(String, nullable=False, server_default='employee')#admin, owner, manager, employee
    auth0_id = Column(String)

    def __init__(self, store_id, 
                monday_start, monday_end, 
                tuesday_start, tuesday_end, 
                wednesday_start, wednesday_end, 
                thursday_start, thursday_end, 
                friday_start, friday_end, 
                saturday_start, saturday_end, 
                sunday_start, sunday_end, 
                number_of_hours, 
                start_date, end_date, 
                role, auth0_id, 
                created_by):
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
        self.start_date = start_date
        self.end_date = end_date
        self.role = role
        self.auth0_id = auth0_id

class EmployeeSchema(Schema):
    id = fields.Number()
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
