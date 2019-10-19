# coding=utf-8

from sqlalchemy import Column, String, Integer, Date, ForeignKey, CheckConstraint
from .entity import Entity, Base, Session
from flask import Blueprint, jsonify, request
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields
from .position import Position

class Shift(Entity, Base):
    __tablename__ = 'shifts'

    position_id = Column(Integer, ForeignKey('positions.id'))
    time_frame_start = Column(Integer, CheckConstraint('time_frame_start>=0 AND time_frame_start<=24 AND time_frame_start<=time_frame_end'))
    time_frame_end = Column(Integer, CheckConstraint('time_frame_end>=0 AND time_frame_end<=24 AND time_frame_end>=time_frame_start'))
    skill_required = Column(Integer)
    people_required = Column(Integer)
    day_of_week = Column(Integer, CheckConstraint('day_of_week>=0 AND day_of_week<=6'))
    effective_date = Column(Date, nullable=True)
    expiration_date = Column(Date, nullable=True)

    def __init__(self, position_id, created_by, time_frame_start, time_frame_end, skill_required, people_required, day_of_week, effective_date=None, expiration_date=None):
        Entity.__init__(self, created_by)
        self.position_id = position_id
        self.time_frame_start = time_frame_start
        self.time_frame_end = time_frame_end
        self.skill_required = skill_required
        self.people_required = people_required
        self.day_of_week = day_of_week
        self.effective_date = effective_date
        self.expiration_date = expiration_date


class ShiftSchema(Schema):
    id = fields.Number()
    position_id = fields.Number()
    time_frame_start = fields.Number()
    time_frame_end = fields.Number()
    skill_required = fields.Number()
    people_required = fields.Number()
    day_of_week = fields.Number()
    effective_date = fields.DateTime()
    expiration_date = fields.DateTime()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('shifts', __name__)

@blueprint.route('/get/shift/<shift_id>', methods=['GET'])
@requires_auth
def get_shift(shift_id):
    # fetching from the database
    session = Session()
    shift_object = session.query(Shift).filter(Shift.shift_id == shift_id).first()

    # transforming into JSON-serializable objects
    schema = ShiftSchema(many=False)
    shift = schema.dump(shift_object)

    # serializing as JSON
    session.close()
    return jsonify(shift)

@blueprint.route('/get/postion/<position_id>', methods=['GET'])
@requires_auth
def get_shifts_of_position(position_id):
    # fetching from the database
    session = Session()
    shift_object = session.query(Shift).filter(Shift.position_id == position_id)

    # transforming into JSON-serializable objects
    schema = ShiftSchema(many=True)
    shift = schema.dump(shift_object)

    # serializing as JSON
    session.close()
    return jsonify(shift)

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