import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '',  component: LoginComponent},
      { path: 'signup',  component: SignupComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}