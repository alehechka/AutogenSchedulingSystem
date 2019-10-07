import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../../env';
import {Department, Position} from './departments.model';
import * as Auth0 from 'auth0-web';

@Injectable()
export class DepartmentApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getStores(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .get(`${API_URL}/stores/get`, httpOptions)
      .catch(DepartmentApiService._handleError);
  }

  saveStore(store: Department): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .post(`${API_URL}/stores/add`, store, httpOptions);
  }

  deleteStore(storeId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .delete(`${API_URL}/stores/delete/${storeId}`, httpOptions);
  }
}