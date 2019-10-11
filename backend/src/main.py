# coding=utf-8

from flask import Flask, jsonify, request
from flask_cors import CORS
from .entities.entity import Session, engine, Base
from .entities.store import Store, StoreSchema, blueprint as stores_blueprint
from .entities.employee import Employee, EmployeeSchema, blueprint as employee_blueprint
from .entities.department import Department, DepartmentSchema, blueprint as department_blueprint
from .entities.position import Position, PositionSchema, blueprint as position_blueprint
from .entities.skill import Skill, SkillSchema, blueprint as skill_blueprint
from .auth import AuthError, requires_auth, requires_role#, requires_user

# creating the Flask application
app = Flask(__name__)
CORS(app)

# if needed, generate database schema
Base.metadata.create_all(engine)

####### EMPLOYEES ##################################################################################################

app.register_blueprint(employee_blueprint, url_prefix='/employee')

####### STORES ##################################################################################################

app.register_blueprint(stores_blueprint, url_prefix='/stores')

####### DEPARTMENTS ##################################################################################################

app.register_blueprint(department_blueprint, url_prefix='/departments')

####### POSITIONS ##################################################################################################

app.register_blueprint(position_blueprint, url_prefix='/position')

####### SKILLS ##################################################################################################

app.register_blueprint(skill_blueprint, url_prefix='/skill')

####### ERRORS ##################################################################################################

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response