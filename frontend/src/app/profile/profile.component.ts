import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from './profile.model';
import { ProfileApiService } from './profile-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Options } from 'ng5-slider';
import { Department } from '../stores/departments/departments.model';
import { DepartmentApiService } from '../stores/departments/departments-api.service';
import { PositionApiService } from '../stores/departments/positions/positions-api.service';
import { SkillApiService } from './skills/skill-api.service';
import { Skill } from './skills/skill.model';
import { MatDialog } from '@angular/material/dialog';

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

  departmentsListSub: Subscription;
  departmentsList: Department[];

  skills: Skill[];

  authenticated = false;
  profileHasArrived = false;
  skillsHaveArrived = false;
  user: UserProfile;
  hoursPanel: boolean;
  skillsPanel: boolean;

  skill_options: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showSelectionBar: true,
    translate: (value: number): string => {
      switch (value) {
        case 0: return "No experience";
        case 10: return "Expert";
        default: return "" + value;
      }
    }
  };

  num_hours_options: Options = {
    floor: 0,
    ceil: 40,
    step: 0.5,
    showSelectionBar: true,
  };
  hours_options: Options = {
    floor: 0,
    ceil: 24,
    step: 0.5,
    minLimit: 7,//Open: populate with store data
    maxLimit: 22.5,//Close: populate with store data
    draggableRange: true,
    translate: (value: number): string => {
      let s = '';
      if (value === this.hours_options.minLimit) {
        return 'Open';
      }
      if (value === this.hours_options.maxLimit) {
        return 'Close';
      }
      if (value === 24) {
        return '11:59pm';
      }
      if (value < 1) {
        s += '12';
      } else if (value > 13) {
        s += '' + (Math.floor(value) - 12);
      } else {
        s += '' + Math.floor(value);
      }
      if (value - Math.floor(value) !== 0) {
        s += ':30';
      } else {
        s += ':00';
      }
      if (value < 12) {
        s += 'am';
      } else {
        s += 'pm';
      }
      return s;
    },
    combineLabels: (minValue: string, maxValue: string): string => {
      return minValue === maxValue ? 'Unable to work' : minValue + ' - ' + maxValue;
    }
  };

  constructor(
    private profileApi: ProfileApiService,
    private departmentsApi: DepartmentApiService,
    private positionsApi: PositionApiService,
    private skillsApi: SkillApiService,
    private dialog: MatDialog,
  ) { }

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
          this.setTempProfile();
          this.getDepartments();
        }
      },
        error => alert(error.message)
      );
  }

  setTempProfile() {
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

  checkUpdateHours() {
    return !(
      this.tempProfile.monday_start !== this.profile.monday_start ||
      this.tempProfile.monday_end !== this.profile.monday_end ||
      this.tempProfile.tuesday_start !== this.profile.tuesday_start ||
      this.tempProfile.tuesday_end !== this.profile.tuesday_end ||
      this.tempProfile.wednesday_start !== this.profile.wednesday_start ||
      this.tempProfile.wednesday_end !== this.profile.wednesday_end ||
      this.tempProfile.thursday_start !== this.profile.thursday_start ||
      this.tempProfile.thursday_end !== this.profile.thursday_end ||
      this.tempProfile.friday_start !== this.profile.friday_start ||
      this.tempProfile.friday_end !== this.profile.friday_end ||
      this.tempProfile.saturday_start !== this.profile.saturday_start ||
      this.tempProfile.saturday_end !== this.profile.saturday_end ||
      this.tempProfile.sunday_start !== this.profile.sunday_start ||
      this.tempProfile.sunday_end !== this.profile.sunday_end ||
      this.tempProfile.number_of_hours !== this.profile.number_of_hours
    );
  }

  closeProfileHours() {
    this.setTempProfile();
    this.hoursPanel = false;
  }

  getDepartments() {
    this.departmentsListSub = this.departmentsApi
      .getDepartments(this.profile.store_id)
      .subscribe(res => {
        this.departmentsList = res;
        this.getPositions();
      },
        error => alert(error.message)
      );
  }

  getPositions() {
    for (let department of this.departmentsList) {
      this.positionsApi
        .getPositions(department.id)
        .subscribe(res => {
          department.positions = res;
          this.getSkills();
        },
          error => alert(error.message)
        );
    }
  }

  getSkills() {
    this.skillsApi
      .getEmployeeSkills(this.profile.id)
      .subscribe(res => {
        this.skills = res;
        this.addSkillsToPositions();
      },
        error => alert(error.message)
      );
  }

  addSkillsToPositions() {
    for (let department of this.departmentsList) {
      for (let position of department.positions) {
        position.skill = new Skill(department.store_id, department.id, position.id, this.profile.id, 0);
        for (let skill of this.skills) {
          if (skill.position_id === position.id) {
            position.skill = Object.assign({}, skill);
          }
        }
      }
    }
    this.skillsHaveArrived = true;
  }

  saveSkills() {
    for (let department of this.departmentsList) {
      for (let position of department.positions) {
        if(position.skill.skill_level !== 0 && typeof position.skill.id === 'undefined') {
          this.skillsApi
            .saveSkill(position.skill)
            .subscribe(res => {},
              error => alert(error.message)
            );
        } else if (typeof position.skill.id !== 'undefined') {
          this.skillsApi
          .updateSkill(position.skill)
          .subscribe(res => {},
            error => alert(error.message)
          );
        }
      }
    }
  }
}