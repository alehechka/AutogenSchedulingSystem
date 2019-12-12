import {Component, OnInit} from '@angular/core';
import * as Auth0 from 'auth0-web';
import {Router} from "@angular/router";
import { ProfileApiService } from './profile/profile-api.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z10">
      <button mat-button (click)="goHome()">Home</button>
      <button mat-button (click)="goStores()" *ngIf="authenticated">Stores</button>
      <button mat-button (click)="goSchedule()" *ngIf="authenticated">Schedule</button>
      <button mat-button (click)="goAbout()">About</button>

      <!-- This fills the remaining space of the current row -->
      <span class="fill-remaining-space"></span>
      <button mat-button (click)="goProfile()" *ngIf="authenticated">Profile</button>
      <button mat-button (click)="signIn();" *ngIf="!authenticated">Sign In</button>
      <button mat-button (click)="signOut(); goHome();" *ngIf="authenticated">Sign Out</button>
    </mat-toolbar>

    <div class="view-container">
      <router-outlet></router-outlet>
    </div>
    {{user}}
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authenticated = false;
  user = null;
  signIn = Auth0.signIn;
  signOut = Auth0.signOut;

  constructor(private router: Router, private profileApi: ProfileApiService) { }

  ngOnInit() {
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  goHome() {
    this.router.navigate(['/home'])
  }

  goAbout() {
    this.router.navigate(['/about'])
  }

  goProfile() {
    this.router.navigate(['/profile'])
  }

  goStores() {
    this.router.navigate(['/stores'])
  }

  goSchedule() {
    this.router.navigate(['/schedule'])
  }
}