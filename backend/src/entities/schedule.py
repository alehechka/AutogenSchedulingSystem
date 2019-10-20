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

@blueprint.route('/get/position/<position_id>', methods=['GET'])
@requires_auth
def get_schedule_by_position(position_id):
    # fetching from the database
    session = Session()
    schedule_object = session.query(Schedule).filter(Schedule.position_id == position_id)
    # transforming into JSON-serializable objects
    schema = ScheduleSchema(many=True)
    schedule = schema.dump(schedule_object)

    # serializing as JSON
    session.close()
    return jsonify(schedule)

@blueprint.route('/get/department/<department_id>', methods=['GET'])
@requires_auth
def get_schedule_by_department(department_id):
    # fetching from the database
    session = Session()
    schedule_object = session.query(Schedule).filter(Schedule.department_id == department_id)
    # transforming into JSON-serializable objects
    schema = ScheduleSchema(many=True)
    schedule = schema.dump(schedule_object)

    # serializing as JSON
    session.close()
    return jsonify(schedule)

@blueprint.route('/get/store/<store_id>', methods=['GET'])
@requires_auth
def get_schedule_by_store(store_id):
    # fetching from the database
    session = Session()
    schedule_object = session.query(Schedule).filter(Schedule.store_id == store_id)
    # transforming into JSON-serializable objects
    schema = ScheduleSchema(many=True)
    schedule = schema.dump(schedule_object)

    # serializing as JSON
    session.close()
    return jsonify(schedule)

@blueprint.route('/add', methods=['POST'], endpoint='add_schedule')
@requires_auth
def add_schedule():
    # mount store object
    posted_schedule = ScheduleSchema(only=('position_id', 'store_id', 'department_id', 'employee_id', 'start_date_time', 'end_date_time')) \
        .load(request.get_json())

    schedule = Schedule(**posted_schedule, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(schedule)
    session.commit()

    # return created store
    new_schedule = ScheduleSchema().dump(schedule)
    session.close()
    return jsonify(new_schedule), 201

@blueprint.route('/update/<schedule_id>', methods=['POST'], endpoint='update_schedule')
@requires_auth
def update_schedule(schedule_id):
    # mount store object
    posted_schedule = ScheduleSchema(only=('position_id', 'store_id', 'department_id', 'employee_id', 'start_date_time', 'end_date_time')) \
        .load(request.get_json())

    request_schedule = Schedule(**posted_schedule, created_by="HTTP post request")

    # persist store
    session = Session()
    schedule = session.query(Schedule).filter(Schedule.id == schedule_id).first()
    schedule.employee_id = request_schedule.employee_id
    schedule.start_date_time = request_schedule.start_date_time
    schedule.end_date_time = request_schedule.end_date_time
    schedule.last_updated_by = request_schedule.last_updated_by
    schedule.updated_at = request_schedule.updated_at
    session.commit()

    # return created store
    new_schedule = ScheduleSchema().dump(schedule)
    session.close()
    return jsonify(new_schedule), 201