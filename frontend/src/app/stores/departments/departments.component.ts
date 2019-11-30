import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Department } from './departments.model';
import { DepartmentApiService } from './departments-api.service';
import { PositionApiService } from './positions/positions-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { Store } from '../stores.model';
import { StoresApiService } from '../stores-api.service';
import { ActivatedRoute } from "@angular/router";
import { Position } from "./positions/positions.model";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  createNewPosition: boolean;
  newPositionName: string;
  newPositionDescription: string;

  constructor(private router: ActivatedRoute, public dialog: MatDialog, private departmentApi: DepartmentApiService, private storesApi: StoresApiService, private positionsApi: PositionApiService) { }

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
    const dialogRef = this.dialog.open(DeleteDepartmentDialog, {
      width: '500px',
      data: {department: this.departmentsList[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result === true) {
        this.delete(this.departmentsList[index].id)
      }
    });
  }
}

export interface DialogData {
  department: Department
}

@Component({
  selector: 'delete-department-dialog',
  template: `<p mat-dialog-title>Are you sure you would like to delete the <i>{{data.department.name}}</i> department?</p>
  <mat-action-row>
  <button mat-button mat-raised-button color="primary" (click)="onNoClick()">
          Cancel
        </button>
      <button mat-button color="warn" [mat-dialog-close]=true>
        Delete
      </button>
      </mat-action-row>`,
})
export class DeleteDepartmentDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDepartmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  

  onNoClick(): void {
    this.dialogRef.close();
  }
}