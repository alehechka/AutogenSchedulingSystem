import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from './stores.model';
import {Router} from "@angular/router";
import { StoresApiService } from './stores-api.service';
import { UserProfile } from 'auth0-web/src/profile';

@Component({
  selector: 'stores',
  template: `
    <h2>Stores</h2>
    <p>Select a store to view schedule.</p>
    <div class="stores">
      <mat-card class="example-card" *ngFor="let store of storesList" class="mat-elevation-z5"
        style="cursor: pointer" (click)="goToStore(store.id)">
        <mat-card-content>
          <mat-card-title>{{store.name}}</mat-card-title>
          <mat-card-subtitle>{{store.description}}</mat-card-subtitle>
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
  styleUrls: ['stores.component.css'],
})
export class StoresComponent implements OnInit, OnDestroy {
  storesListSubs: Subscription;
  storesList: Store[];
  authenticated = false;
  user: UserProfile;

  constructor(private router: Router, private storesApi: StoresApiService) { }

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

  goToStore(storeId: number) {
    this.router.navigate([`/departments/${storeId}`])
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}