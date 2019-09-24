import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from './profile.model';
import { ProfileApiService } from './profile-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import {Router} from "@angular/router";

@Component({
  selector: 'employee',
  template: `
    <h2>{{user.name}}</h2>
    <p>{{user.nickname}}</p>
    {{user|json}}
    {{profile}}
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
    this.profileListSubs = this.profileApi
      .getProfile()
      .subscribe(res => {
        this.profileList = res;
      },
        console.error
      );
      let profile = {
        store_id: 1,
        role: 'employee',
        auth0_id: Auth0.getProfile().sub,
        end_date: new Date()
      }
      this.profileApi
        .saveProfile(profile)
        .subscribe(
          () => this.router.navigate(['/stores']),
          error => alert(error.message)
        );
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.profileListSubs.unsubscribe();
  }

  // delete(storeId: number) {
  //   this.profileApi
  //     .deleteStore(storeId)
  //     .subscribe(() => {
  //       this.profileListSubs = this.profileApi
  //         .getProfile()
  //         .subscribe(res => {
  //             this.profileList = res;
  //           },
  //           console.error
  //         )
  //     }, console.error);
  // }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}