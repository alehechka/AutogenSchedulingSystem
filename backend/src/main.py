# coding=utf-8

from flask import Flask, jsonify, request
from flask_cors import CORS
from .entities.entity import Session, engine, Base
from .entities.store import Store, StoreSchema
from .entities.employee import Employee, EmployeeSchema
from .auth import AuthError, requires_auth, requires_role

# creating the Flask application
app = Flask(__name__)
CORS(app)

# if needed, generate database schema
Base.metadata.create_all(engine)

####### EMPLOYEES ##################################################################################################

@app.route('/employee/<auth0_id>', methods=['GET'])
@requires_auth
def get_employee(auth0_id):
    # fetching from the database
    session = Session()
    employee_object = session.query(Employee).filter(Employee.auth0_id == auth0_id).first()

    # transforming into JSON-serializable objects
    schema = EmployeeSchema(many=False)
    employee = schema.dump(employee_object)

    # serializing as JSON
    session.close()
    return jsonify(employee)

@app.route('/employee', methods=['POST'], endpoint='add_employee')
@requires_auth
def add_employee():
    # mount store object
    posted_employee = EmployeeSchema(only=('store_id', 
                'monday_start', 'monday_end', 
                'tuesday_start', 'tuesday_end', 
                'wednesday_start', 'wednesday_end', 
                'thursday_start', 'thursday_end', 
                'friday_start', 'friday_end', 
                'saturday_start', 'saturday_end', 
                'sunday_start', 'sunday_end', 
                'number_of_hours', 
                'start_date', 'end_date', 
                'role', 'auth0_id')) \
        .load(request.get_json())

    employee = Employee(**posted_employee, created_by="HTTP post request")

    # persist store
    session = Session()
    session.add(employee)
    session.commit()

    # return created store
    new_employee = EmployeeSchema().dump(employee)
    session.close()
    return jsonify(new_employee), 201

@app.route('/employee/update-hours/<auth0_id>', methods=['POST'], endpoint='update_employee')
@requires_auth
#@requires_role('employee')
def update_employee(auth0_id):
    # mount store object
    posted_employee = EmployeeSchema(only=('store_id', 
                'monday_start', 'monday_end', 
                'tuesday_start', 'tuesday_end', 
                'wednesday_start', 'wednesday_end', 
                'thursday_start', 'thursday_end', 
                'friday_start', 'friday_end', 
                'saturday_start', 'saturday_end', 
                'sunday_start', 'sunday_end', 
                'number_of_hours', 'auth0_id')) \
        .load(request.get_json())

    request_employee = Employee(**posted_employee, created_by="HTTP post request")

    # persist employee
    session = Session()
    employee = session.query(Employee).filter(Employee.auth0_id == auth0_id).first()
    print(request_employee.monday_start)
    employee.monday_end = request_employee.monday_end
    session.commit()

    # return updated employee
    updated_employee = EmployeeSchema().dump(employee)
    session.close()
    return jsonify(updated_employee), 201

####### STORES ##################################################################################################

@app.route('/stores', methods=['GET'])
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

@app.route('/stores', methods=['POST'], endpoint='add_store')
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

"""@app.route('/exams/<examId>', methods=['DELETE'], endpoint='delete_exam')
@requires_auth
@requires_role('admin')
def delete_exam(examId):
    session = Session()
    exam = session.query(Exam).filter_by(id=examId).first()
    session.delete(exam)
    session.commit()
    session.close()
    return '', 201
"""

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response