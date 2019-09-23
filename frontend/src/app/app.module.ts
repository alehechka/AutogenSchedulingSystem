import * as Auth0 from 'auth0-web';
import {CallbackComponent} from './callback.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';

import {RouterModule, Routes} from '@angular/router';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule,
} from '@angular/material';

import { StoresComponent } from './stores/stores.component';
import { StoreFormComponent } from './stores/stores-form.component';
import { StoresApiService } from './stores/stores-api.service';

import { ProfileComponent } from './profile/profile.component';
import { ProfileApiService } from './profile/profile-api.service';


const appRoutes: Routes = [
  { path: 'new-store', component: StoreFormComponent },
  { path: 'stores', component: StoresComponent },
  { path: 'callback', component: CallbackComponent },
  {path: 'profile', component: ProfileComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    StoreFormComponent,
    StoresComponent,
    ProfileComponent,
    CallbackComponent,
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
  ],
  providers: [StoresApiService, ProfileApiService, ],
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
