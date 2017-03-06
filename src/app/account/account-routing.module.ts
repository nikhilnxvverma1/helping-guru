import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProjectHomeComponent } from './project/project-home/project-home.component';

import { DescriptionComponent } from './project/description/description.component';
import { ProgressionComponent } from './project/progression/progression.component';
import { DiscussionComponent } from './project/discussion/discussion.component';
import { FullThreadComponent } from './project/full-thread/full-thread.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path:'home', component:HomeComponent, 
		children:[
			{ path: '', redirectTo: 'dashboard', pathMatch:'full'},
			{ path:'dashboard', component:DashboardComponent},
			{ path:'new-project', component:NewProjectComponent},
			{ path:'my-projects', component:MyProjectsComponent},
			{ path:'all-projects', component:AllProjectsComponent},
			{ path:'search', component:SearchResultComponent},
			{ path:'project', component:ProjectHomeComponent,
			children:[
				{ path: '', redirectTo: 'description', pathMatch:'full'},
				{ path:'description', component:DescriptionComponent},
				{ path:'discussion', component:DiscussionComponent},
				{ path:'progression', component:ProgressionComponent},
				{ path:'thread', component:FullThreadComponent}
			]}
	  ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}