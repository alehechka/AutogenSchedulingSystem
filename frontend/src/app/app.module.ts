import * as Auth0 from 'auth0-web';
import { CallbackComponent } from './callback.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule,
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { StoresComponent } from './stores/stores.component';
import { StoreFormComponent } from './stores/stores-form.component';
import { StoresApiService } from './stores/stores-api.service';

import { ProfileComponent } from './profile/profile.component';
import { ProfileApiService } from './profile/profile-api.service';

import { DepartmentComponent } from './stores/departments/departments.component';
import { DeleteItemDialog } from './components/delete-item.component';
import { DepartmentApiService } from './stores/departments/departments-api.service'
import { DepartmentFormComponent } from './stores/departments/departments-form.component';

import { PositionApiService } from './stores/departments/positions/positions-api.service';


const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'new-store', component: StoreFormComponent },
  { path: 'stores', component: StoresComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'departments/:store_id', component: DepartmentComponent },
  { path: 'new-department/:store_id', component: DepartmentFormComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    StoreFormComponent,
    StoresComponent,
    ProfileComponent,
    DepartmentComponent,
    DeleteItemDialog,
    DepartmentFormComponent,
    CallbackComponent,
  ],
  entryComponents: [
    DeleteItemDialog,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    StoresApiService, ProfileApiService, DepartmentApiService, PositionApiService,],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Auth0.configure({
      domain: 'dev-9r28-4jz.auth0.com',
      audience: 'https://online-exam.digituz.com.br',
      clientID: 'Un8JHzEVO5VXfEG4Q15X8OQ3HOnvmeLK',
      redirectUri: 'http://localhost:4200/callback',
      scope: 'openid profile manage:stores'
    });
  }
}
