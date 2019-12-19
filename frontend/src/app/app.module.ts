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
import { MatMenuModule } from '@angular/material/menu';
import { Ng5SliderModule } from 'ng5-slider';

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

import { SkillApiService } from './profile/skills/skill-api.service';

import { ScheduleApiService } from './schedule/schedule-api.service';
import { ScheduleComponent } from './schedule/schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


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
  { path: 'schedule/:store_id/:view', component: ScheduleComponent },
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
    ScheduleComponent,
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
    Ng5SliderModule,
    MatMenuModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    StoresApiService, ProfileApiService, DepartmentApiService, PositionApiService, SkillApiService, ScheduleApiService, ],
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
