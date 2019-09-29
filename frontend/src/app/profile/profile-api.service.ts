import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../env';
import {Profile} from './profile.model';
import * as Auth0 from 'auth0-web';

@Injectable()
export class ProfileApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getProfile(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    let userId = Auth0.getProfile().sub;
    return this.http
      .get(`${API_URL}/employee/${userId}`, httpOptions)
      .catch(ProfileApiService._handleError);
  }

  saveProfile(profile: Profile): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    return this.http
      .post(`${API_URL}/employee`, profile, httpOptions);
  }

  updateProfile(profile: Profile): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${Auth0.getAccessToken()}`
      })
    };
    let userId = Auth0.getProfile().sub;
    return this.http
      .post(`${API_URL}/employee/update-hours/${userId}`, profile, httpOptions);
  }

  // deleteStore(storeId: number) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${Auth0.getAccessToken()}`
  //     })
  //   };
  //   return this.http
  //     .delete(`${API_URL}/stores/${storeId}`, httpOptions);
  // }
}