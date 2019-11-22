import * as Auth0 from 'auth0-web';
import {Component, OnInit} from '@angular/core';
import {DepartmentApiService} from "./departments-api.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'store-form',
  template: `
    <mat-card>
      <h2>New Department</h2>
        <mat-form-field class="full-width">
          <input matInput
                 placeholder="Name"
                 [(ngModel)]="department.name">
        </mat-form-field>

        <mat-form-field class="full-width">
          <input matInput
                 placeholder="Description"
                 [(ngModel)]="department.description">
        </mat-form-field>
        <button mat-raised-button
                color="primary"
                disabled={{!isAdmin()}}
                (click)="saveDepartment()">
          Create Department
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
export class DepartmentFormComponent implements OnInit {
  authenticated = false;
  department = {
    store_id: 0,
    name: '',
    description: '',
  };
  store_id: string;

  constructor(private departmentsApi: DepartmentApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const self = this;
    this.store_id = this.route.snapshot.paramMap.get("store_id");
    this.department.store_id = parseInt(this.store_id);
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }
  
  saveDepartment() {
    this.departmentsApi
      .saveDepartment(this.department)
      .subscribe(
        () => this.router.navigate([`/department/${this.store_id}`]),
        error => alert(error.message)
      );
  }

  isAdmin() {
    if (!Auth0.isAuthenticated()) return false;

    const roles = Auth0.getProfile()['https://online-exams.com/roles'];
    return roles.includes('admin');
  }
}