# coding=utf-8

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, CheckConstraint
from .entity import Entity, Base, Session
from flask import Blueprint, jsonify, request
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields
from .position import Position
from .store import Store
from .department import Department
from .employee import Employee

class Schedule(Entity, Base):
    __tablename__ = 'schedule'

    position_id = Column(Integer, ForeignKey('positions.id'))
    store_id = Column(Integer, ForeignKey('stores.id'))
    department_id = Column(Integer, ForeignKey('departments.id'))
    employee_id = Column(Integer, ForeignKey('employees.id'))
    start_date_time = Column(DateTime, CheckConstraint('start_date_time<end_date_time'))
    end_date_time = Column(DateTime, CheckConstraint('end_date_time>start_date_time'))

    def __init__(self, position_id, store_id, department_id, employee_id, created_by, start_date_time, end_date_time):
        Entity.__init__(self, created_by)
        self.position_id = position_id
        self.store_id = store_id
        self.department_id = department_id
        self.employee_id = employee_id
        self.start_date_time = start_date_time
        self.end_date_time = end_date_time


class ScheduleSchema(Schema):
    id = fields.Number()
    position_id = fields.Number()
    store_id = fields.Number()
    department_id = fields.Number()
    employee_id = fields.Number()
    start_date_time = fields.DateTime()
    end_date_time = fields.DateTime()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('schedule', __name__)

@blueprint.route('/get/employee/<employee_id>', methods=['GET'])
@requires_auth
def get_schedule_by_employee(employee_id):
    # fetching from the database
    session = Session()
    schedule_object = session.query(Schedule).filter(Schedule.employee_id == employee_id)
    # transforming into JSON-serializable objects
    schema = ScheduleSchema(many=True)
    schedule = schema.dump(schedule_object)

    # serializing as JSON
    session.close()
    return jsonify(schedule)

@blueprint.route('/add', methods=['POST'], endpoint='add_shift')
@requires_auth
def add_shift():
    # mount store object
    posted_shift = ShiftSchema(only=('position_id', 'time_frame_start', 'time_frame_end', 'skill_required', 'people_required', 'day_of_week', 'effective_date', 'expiration_date')) \
        .load(request.get_json())

    shift = Shift(**posted_shift, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(shift)
    session.commit()

    # return created store
    new_shift = ShiftSchema().dump(shift)
    session.close()
    return jsonify(new_shift), 201