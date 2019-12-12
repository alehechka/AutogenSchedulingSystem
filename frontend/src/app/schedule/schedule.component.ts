import * as Auth0 from 'auth0-web';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Schedule } from './schedule.model';
import {Router} from "@angular/router";
import { ScheduleApiService } from './schedule-api.service';
import { UserProfile } from 'auth0-web/src/profile';

@Component({
  selector: 'schedule',
  templateUrl: "./schedule-template.html",
  styleUrls: ['schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  storesListSubs: Subscription;
  storesList: Schedule[];
  authenticated = false;
  user: UserProfile;

  constructor(private router: Router, private scheduleApi: ScheduleApiService) { }

  ngOnInit() {
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }
}