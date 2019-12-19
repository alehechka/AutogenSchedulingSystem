import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../env';
import * as Auth0 from 'auth0-web';

@Injectable()
export class ScheduleApiService {

  constructor(private http: HttpClient) {
  }

  getSchedule(store_id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .get(`${API_URL}/schedule/get/store/${store_id}`, httpOptions)
      .catch(ScheduleApiService._handleError);
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }
}