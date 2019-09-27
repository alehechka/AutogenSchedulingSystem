import * as Auth0 from 'auth0-web';
import {Component, OnInit} from '@angular/core';
import {StoresApiService} from "./stores-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'store-form',
  template: `
    <mat-card>
      <h2>New Store</h2>
        <mat-form-field class="full-width">
          <input matInput
                 placeholder="Name"
                 (keyup)="updateName($event)">
        </mat-form-field>

        <mat-form-field class="full-width">
          <input matInput
                 placeholder="Description"
                 (keyup)="updateDescription($event)">
        </mat-form-field>

        <mat-form-field class="full-width">
          <input matInput
                    placeholder="Street Address"
                    (keyup)="updateStreetAddress($event)">
        </mat-form-field>

        <mat-form-field class="full-width">
          <input type="number" matInput
                    placeholder="Zip Code"
                    (keyup)="updateZipCode($event)">
        </mat-form-field>

        <button mat-raised-button
                color="primary"
                disabled={{!isAdmin()}}
                (click)="saveStore()">
          Create Store
        </button>
    </mat-card>
  `,
  styles: [`
    .stores-form {
      min-width: 150px;
      max-width: 500px;
      width: 100%;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class StoreFormComponent implements OnInit {
  authenticated = false;
  store = {
    street_address: '',
    phone_number: null,
    zip_code: null,
    name: '',
    description: '',
  };

  constructor(private storesApi: StoresApiService, private router: Router) { }

  ngOnInit() {
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  updateStreetAddress(event: any) {
    this.store.street_address = event.target.value;
  }

  updatePhoneNumber(event: any) {
    this.store.phone_number = event.target.value;
  }

  updateZipCode(event: any) {
    this.store.zip_code = event.target.value;
  }

  updateName(event: any) {
    this.store.name = event.target.value;
  }

  updateDescription(event: any) {
    this.store.description = event.target.value;
  }

  saveStore() {
    this.storesApi
      .saveStore(this.store)
      .subscribe(
        () => this.router.navigate(['/stores']),
        error => alert(error.message)
      );
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}