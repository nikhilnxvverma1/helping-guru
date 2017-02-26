import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ProjectHomeComponent } from './project/project-home/project-home.component';

import { DescriptionComponent } from './project/description/description.component';
import { ProgressionComponent } from './project/progression/progression.component';
import { DiscussionComponent } from './project/discussion/discussion.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      { path:'home', component:HomeComponent, 
		children:[
			{ path:'my-projects', component:MyProjectsComponent},
			{ path:'project', component:ProjectHomeComponent,
			children:[
				{ path: '', redirectTo: 'description', pathMatch:'full'},
				{ path:'description', component:DescriptionComponent},
				{ path:'discussion', component:DiscussionComponent},
				{ path:'progression', component:ProgressionComponent}
			]}
	  ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}