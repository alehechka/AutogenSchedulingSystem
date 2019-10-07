import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Department, Position } from './departments.model';
import { DepartmentApiService } from './departments-api.service';
import { UserProfile } from 'auth0-web/src/profile';

@Component({
  selector: 'stores',
  template: `
    <h2>Stores</h2>
    <p>Select a store to view schedule.</p>
    <div class="stores">
      <mat-card class="example-card" *ngFor="let store of storesList" class="mat-elevation-z5">
        <mat-card-content>
          <mat-card-title>{{store.name}}</mat-card-title>
          <mat-card-subtitle>{{store.description}}</mat-card-subtitle>
          <p>
            {{store.streetAddress}}
          </p>
          <button mat-raised-button color="accent">Schedule</button>
          <button mat-button color="warn" *ngIf="isAdmin()"
                  (click)="delete(store.id)">
            Delete
          </button>
        </mat-card-content>
      </mat-card>
    </div>
    <button mat-fab color="primary" *ngIf="isAdmin()"
            class="new-store" routerLink="/new-store">
      <i class="material-icons">note_add</i>
    </button>
  `,
  styleUrls: ['departments.component.css'],
})
export class DepartmentComponent implements OnInit, OnDestroy {
  storesListSubs: Subscription;
  storesList: Department[];
  authenticated = false;
  user: UserProfile;

  constructor(private storesApi: DepartmentApiService) { }

  ngOnInit() {
    this.storesListSubs = this.storesApi
      .getStores()
      .subscribe(res => {
        this.storesList = res;
      },
        console.error
      );
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.storesListSubs.unsubscribe();
  }

  delete(storeId: number) {
    this.storesApi
      .deleteStore(storeId)
      .subscribe(() => {
        this.storesListSubs = this.storesApi
          .getStores()
          .subscribe(res => {
              this.storesList = res;
            },
            console.error
          )
      }, console.error);
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}