import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectHomeComponent } from './project-home/project-home.component';
import { DescriptionComponent } from './description/description.component';
import { ProgressionComponent } from './progression/progression.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ThreadComponent } from './thread/thread.component';
import { CommentComponent } from './comment/comment.component';
import { ContributionComponent } from './contribution/contribution.component';

@NgModule({
  imports: [
    CommonModule,
	BrowserModule,
	FormsModule,
	// ProjectRoutingModule
  ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProjectHomeComponent, DescriptionComponent, ProgressionComponent, DiscussionComponent, ThreadComponent, CommentComponent, ContributionComponent]
})
export class ProjectModule { }
