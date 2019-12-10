import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from './profile.model';
import { ProfileApiService } from './profile-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Options } from 'ng5-slider';

@Component({
  selector: 'employee',
  templateUrl: "./profile-template.html",
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileListSubs: Subscription;
  profile: Profile;
  tempProfile: {
    store_id: number,
    auth0_id: string,
    monday_start: number,
    monday_end: number,
    tuesday_start: number,
    tuesday_end: number,
    wednesday_start: number,
    wednesday_end: number,
    thursday_start: number,
    thursday_end: number,
    friday_start: number,
    friday_end: number,
    saturday_start: number,
    saturday_end: number,
    sunday_start: number,
    sunday_end: number,
    number_of_hours: number,
  };
  authenticated = false;
  profileHasArrived = false;
  user: UserProfile;
  hoursPanel:boolean;
  options: Options = {
    floor: 0,
    ceil: 40,
    step: 0.5,
    showSelectionBar: true,
  };
  hours_options: Options = {
    floor: 0,
    ceil: 24,
    step: 0.5,
    translate: (value: number): string => {
      let s = '';
      if(value === 24) {
        return '11:59pm';
      }
      if(value<1) {
        s += '12';
      } else if (value > 13) {
        s += '' + (Math.floor(value)-12);
      } else {
        s += '' + Math.floor(value);
      }
      if(value-Math.floor(value) !== 0) {
        s += ':30';
      } else {
        s += ':00';
      }
      if(value<12) {
        s += 'am';
      } else {
        s += 'pm';
      }
      return s;
    }
  };

  constructor(private profileApi: ProfileApiService) { }

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
        this.profile = res;
        if (typeof this.profile.auth0_id === 'undefined') {
          this.createInitalDbProfile();
        } else {
          this.profileHasArrived = true;
          this.tempProfile = {
            store_id: this.profile.store_id,
            auth0_id: this.profile.auth0_id,
            monday_start: this.profile.monday_start,
            monday_end: this.profile.monday_end,
            tuesday_start: this.profile.tuesday_start,
            tuesday_end: this.profile.tuesday_end,
            wednesday_start: this.profile.wednesday_start,
            wednesday_end: this.profile.wednesday_end,
            thursday_start: this.profile.thursday_start,
            thursday_end: this.profile.thursday_end,
            friday_start: this.profile.friday_start,
            friday_end: this.profile.friday_end,
            saturday_start: this.profile.saturday_start,
            saturday_end: this.profile.saturday_end,
            sunday_start: this.profile.sunday_start,
            sunday_end: this.profile.sunday_end,
            number_of_hours: this.profile.number_of_hours,
          }
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
    this.hoursPanel = false;
    this.profileApi
      .updateProfile(this.tempProfile)
      .subscribe(res => {
        this.profile = res;
      },
        error => alert(error.message)
      );
  }
}