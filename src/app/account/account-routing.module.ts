import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path:'home', component:HomeComponent, 
		children:[
			{ path:'my-projects', component:MyProjectsComponent}
	  ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}