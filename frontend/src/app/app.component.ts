import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import * as Auth0 from 'auth0-web';
import {Router} from "@angular/router";
import { UserProfile } from 'auth0-web/src/profile';

@Component({
  selector: 'app-root',
  templateUrl: "./app-template.html",
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  authenticated = false;
  user: UserProfile;
  signIn = Auth0.signIn;
  signOut = Auth0.signOut;
  constructor(private router: Router) { }

  ngOnInit() {
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
    this.updateUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateUser();
  }

  updateUser() {
    this.user = Auth0.getProfile();
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
    this.router.navigate(['/schedule/1/month'])
  }
  
}