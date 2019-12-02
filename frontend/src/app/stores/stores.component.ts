import * as Auth0 from 'auth0-web';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from './stores.model';
import {Router} from "@angular/router";
import { StoresApiService } from './stores-api.service';
import { UserProfile } from 'auth0-web/src/profile';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialog } from '../components/delete-item.component';

@Component({
  selector: 'stores',
  templateUrl: "./stores-template.html",
  styleUrls: ['stores.component.css'],
})
export class StoresComponent implements OnInit, OnDestroy {
  storesListSubs: Subscription;
  storesList: Store[];
  authenticated = false;
  user: UserProfile;

  constructor(private router: Router, private storesApi: StoresApiService, public dialog: MatDialog) { }

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

  openDeleteStoreDialog(index: number) {
    const dialogRef = this.dialog.open(DeleteItemDialog, {
      width: '500px',
      data: {item: this.storesList[index].name, itemType: 'store'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result === true) {
        this.delete(this.storesList[index].id)
      }
    });
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