import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Department } from './departments.model';
import { DepartmentApiService } from './departments-api.service';
import { PositionApiService } from './positions/positions-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Store } from '../stores.model';
import { StoresApiService } from '../stores-api.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'departments',
  templateUrl: "./departments-template.html",
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

  constructor(private router: ActivatedRoute, private departmentApi: DepartmentApiService, private storesApi: StoresApiService, private positionsApi: PositionApiService) { }

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

  populatePositions(index: number, departmentId: number) {
    this.positionsApi
      .getPositions(departmentId)
      .subscribe(res => {
        this.departmentsList[index].positions = res;
      },
        console.error
      );
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}