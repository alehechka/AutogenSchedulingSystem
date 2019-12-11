import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../../env';
import {Skill} from './skill.model';
import * as Auth0 from 'auth0-web';

@Injectable()
export class SkillApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getEmployeeSkills(employee_id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .get(`${API_URL}/skills/get/employee/${employee_id}`, httpOptions)
      .catch(SkillApiService._handleError);
  }

  saveSkill(skill: Skill): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .post(`${API_URL}/skills/add`, skill, httpOptions);
  }

  updateSkill(skill: Skill): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .post(`${API_URL}/employee/update-hours/${skill.id}`, skill, httpOptions);
  }
}