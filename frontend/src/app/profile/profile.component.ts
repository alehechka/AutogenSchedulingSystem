import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from './profile.model';
import { ProfileApiService } from './profile-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Router } from "@angular/router";

@Component({
  selector: 'employee',
  template: `
    <h2>{{user.name}}</h2>
    <p>{{user.email}}</p>
    {{user|json}}
    <br><br>
    {{profileList|json}}
    <br><br>
    <button (click)="updateProfile()">Update</button>
  `,
  styleUrls: ['profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileListSubs: Subscription;
  profileList: Profile[];
  authenticated = false;
  user: UserProfile;

  constructor(private profileApi: ProfileApiService, private router: Router) { }

  ngOnInit() {
    this.user = Auth0.getProfile();
    this.getUserProfile();
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.profileListSubs.unsubscribe();
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = this.user['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
  getUserProfile() {
    this.profileListSubs = this.profileApi
      .getProfile()
      .subscribe(res => {
        this.profileList = res;
        if (this.profileList.length === 0) {
          this.createInitalDbProfile();
        }
      },
        console.error
      );
  }

  createInitalDbProfile() {
    let profile = {
      store_id: 1,
      auth0_id: Auth0.getProfile().sub,
      role: this.user['https://online-exams.com/roles'][0]
    }
    this.profileApi
      .saveProfile(profile)
      .subscribe(
        () => this.getUserProfile(),
        error => alert(error.message)
      );
  }

  updateProfile() {
    let profile = {
      store_id: 1,
      auth0_id: Auth0.getProfile().sub,
      
    }
    this.profileApi
      .updateProfile(profile)
      .subscribe(
        () => this.getUserProfile(),
        error => alert(error.message)
      );
  }
}