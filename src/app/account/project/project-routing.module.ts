import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectHomeComponent } from './project-home/project-home.component';

import { DescriptionComponent } from './description/description.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ContributionComponent } from './contribution/contribution.component';
import { ProgressionComponent } from './progression/progression.component';


/**
 * @deprecated This routing module is not working. Get rid of it when you get the chance
 */
@NgModule({
	imports: [
		RouterModule.forChild([
			{ path:'project', component:ProjectHomeComponent, 
			children:[
				{ path: '', redirectTo: 'description', pathMatch:'full'},
				{ path:'description', component:DescriptionComponent},
				{ path:'discussion', component:DiscussionComponent},
				{ path:'progression', component:ProgressionComponent}
			]}
		])
	],
	exports: [RouterModule]
})
export class ProjectRoutingModule {}// { path: '', redirectTo: 'description'},