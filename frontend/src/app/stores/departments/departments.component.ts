import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Department, Position } from './departments.model';
import { DepartmentApiService } from './departments-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Store } from '../stores.model';
import { StoresApiService } from '../stores-api.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'departments',
  template: `
    <h2 *ngIf="store !== undefined">Departments for Store: {{store.name}}</h2>
    <p>Select a department to view schedule.</p>
    <div class="departments" *ngIf="departmentsList !== undefined">
      <mat-card class="example-card" *ngFor="let department of departmentsList" class="mat-elevation-z5">
        <mat-card-content>
          <mat-card-title>{{department.name}}</mat-card-title>
          <mat-card-subtitle>{{department.description}}</mat-card-subtitle>
          <button mat-raised-button color="accent">Schedule</button>
          <button mat-button color="warn" *ngIf="isAdmin()"
                  (click)="delete(department._id)">
            Delete
          </button>
        </mat-card-content>
      </mat-card>
    </div>
    <button mat-fab color="primary" *ngIf="isAdmin()"
            class="new-store" routerLink="/new-department/{{store_id}}">
      <i class="material-icons">note_add</i>
    </button>
  `,
  styleUrls: ['departments.component.css'],
})
export class DepartmentComponent implements OnInit, OnDestroy {
  departmentsListSubs: Subscription;
  storesListSubs: Subscription;
  departmentsList: Department[];
  authenticated = false;
  user: UserProfile;
  store: Store;
  store_id: string;

  constructor(private router: ActivatedRoute, private departmentApi: DepartmentApiService, private storesApi: StoresApiService) { }

  ngOnInit() {
    this.store_id = this.router.snapshot.paramMap.get("store_id");
    this.storesListSubs = this.storesApi
      .getStore(this.store_id)
      .subscribe(res => {
        this.store = res;
      },
        console.error
      );
    this.departmentsListSubs = this.departmentApi
      .getDepartments(this.store_id)
      .subscribe(res => {
        this.departmentsList = res;
      },
        console.error
      );
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.departmentsListSubs.unsubscribe();
    this.storesListSubs.unsubscribe();
  }

  delete(departmentId: number) {
    this.departmentApi
      .deleteDepartment(departmentId)
      .subscribe(() => {
        this.departmentsListSubs = this.departmentApi
          .getDepartments(this.store._id)
          .subscribe(res => {
            this.departmentsList = res;
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