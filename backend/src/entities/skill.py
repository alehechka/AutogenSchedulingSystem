# coding=utf-8

from sqlalchemy import Column, String, Integer, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from .entity import Entity, Base, Session
from flask import Blueprint, jsonify, request
from ..auth import AuthError, requires_auth, requires_role
from marshmallow import Schema, fields
from .position import Position
from .employee import Employee

class Skill(Entity, Base):
    __tablename__ = 'skills'

    position_id = Column(Integer, ForeignKey('positions.id'))
    employee_id = Column(Integer, ForeignKey('employees.id'))
    skill_level = Column(Integer, CheckConstraint('skill_level>=0 AND skill_level<=10'), nullable=False, default=0)

    def __init__(self, position_id, employee_id, created_by, skill_level):
        Entity.__init__(self, created_by)
        self.position_id = position_id
        self.employee_id = employee_id
        self.skill_level = skill_level


class SkillSchema(Schema):
    id = fields.Number()
    position_id = fields.Number()
    employee_id = fields.Number()
    skill_level = fields.Number()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()

####### FLASK ENDPOINTS ##################################################################################################

blueprint = Blueprint('skills', __name__)

@blueprint.route('/get/position/<position_id>', methods=['GET'])
@requires_auth
def get_skills_by_position(position_id):
    # fetching from the database
    session = Session()
    skill_object = session.query(Skill).filter(Skill.position_id == position_id)

    # transforming into JSON-serializable objects
    schema = SkillSchema(many=True)
    skills = schema.dump(skill_object)

    # serializing as JSON
    session.close()
    return jsonify(skills)

@blueprint.route('/get/employee/<employee_id>', methods=['GET'])
@requires_auth
def get_skills_by_employee(employee_id):
    # fetching from the database
    session = Session()
    skill_object = session.query(Skill).filter(Skill.employee_id == employee_id)

    # transforming into JSON-serializable objects
    schema = SkillSchema(many=True)
    skills = schema.dump(skill_object)

    # serializing as JSON
    session.close()
    return jsonify(skills)

@blueprint.route('/add', methods=['POST'], endpoint='add_position')
@requires_auth
def add_position():
    # mount store object
    posted_skill = SkillSchema(only=('position_id', 'employee_id', 'skill_level')) \
        .load(request.get_json())

    skill = Skill(**posted_skill, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(skill)
    session.commit()

    # return created store
    new_skill = SkillSchema().dump(skill)
    session.close()
    return jsonify(new_skill), 201

@blueprint.route('/update/<skill_id>', methods=['POST'], endpoint='update_skill')
@requires_auth
#@requires_user(request.get_json().auth0_id)
def update_employee(skill_id):
    # mount store object
    posted_skill = SkillSchema(only=('position_id', 'employee_id', 'skill_level')) \
        .load(request.get_json())

    request_skill = Skill(**posted_skill, created_by="HTTP post request")

    # persist employee
    session = Session()
    skill = session.query(Skill).filter(Skill.id == skill_id).first()
    skill.skill_level = request_skill.skill_level
    skill.last_updated_by = request_skill.last_updated_by
    skill.updated_at = request_skill.updated_at
    session.commit()

    # return updated employee
    updated_skill = SkillSchema().dump(skill)
    session.close()
    return jsonify(updated_skill), 201