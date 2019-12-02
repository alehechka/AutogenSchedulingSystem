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
import { Position } from "./positions/positions.model";
import { DeleteItemDialog } from '../../components/delete-item.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private router: ActivatedRoute, 
    private dialog: MatDialog, 
    private departmentApi: DepartmentApiService, 
    private storesApi: StoresApiService, 
    private positionsApi: PositionApiService
  ) { }

  ngOnInit() {
    this.store_id = this.router.snapshot.paramMap.get("store_id");
    this.storesListSubs = this.storesApi
      .getStore(this.store_id)
      .subscribe(res => {
        this.store = res;
      },
        console.error
      );
    this.getDepartments();
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.departmentsListSubs.unsubscribe();
    this.storesListSubs.unsubscribe();
  }

  getDepartments() {
    this.departmentsListSubs = this.departmentApi
      .getDepartments(this.store_id)
      .subscribe(res => {
        this.departmentsList = res;
      },
        console.error
      );
  }

  delete(departmentId: number) {
    this.departmentApi
      .deleteDepartment(departmentId)
      .subscribe(() => {
        this.departmentsListSubs = this.departmentApi
          .getDepartments(this.store_id)
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

  addPosition(index: number) {
    this.departmentsList[index].createNewPosition = !this.departmentsList[index].createNewPosition;
  }

  clearPosition(index: number) {
    this.departmentsList[index].newPositionName = "";
    this.departmentsList[index].newPositionDescription = "";
  }

  savePosition(name: string, desc: string, department_id: number, index: number) {
    this.positionsApi
      .savePosition(new Position(department_id, name, desc))
      .subscribe(() => {
        this.populatePositions(index, department_id);
      },
        console.error
      );
    this.clearPosition(index);
    this.addPosition(index);
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }

  openDeleteDepartmentDialog(index: number) {
    const dialogRef = this.dialog.open(DeleteItemDialog, {
      width: '500px',
      data: { item: this.departmentsList[index].name, itemType: 'department' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === true) {
        this.delete(this.departmentsList[index].id)
      }
    });
  }

  editDepartment(index: number) {
    this.departmentsList[index].editing = !this.departmentsList[index].editing;
    this.departmentsList[index].newName = this.departmentsList[index].name;
    this.departmentsList[index].newDescription = this.departmentsList[index].description;
  }

  updateDepartment(index: number) {
    let dep = this.departmentsList[index];
    let update = new Department(dep.store_id, dep.newName, dep.newDescription);
    this.departmentApi
      .updateDepartment(update, dep.id)
      .subscribe(
        () => this.getDepartments(),
        error => alert(error.message)
      );
  }

  editPositions(index: number) {
    this.departmentsList[index].editPosition = !this.departmentsList[index].editPosition;
  }

  checkPositionChanges() {
    return true;
  }

  updatePositions() {

  }
}