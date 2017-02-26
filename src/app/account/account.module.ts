import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from '../helpers/account.service';
import { ProjectService } from '../helpers/project.service';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectModule } from './project/project.module';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProjectHomeComponent } from './project/project-home/project-home.component';
import { DescriptionComponent } from './project/description/description.component';
import { ProgressionComponent } from './project/progression/progression.component';
import { DiscussionComponent } from './project/discussion/discussion.component';
import { ThreadComponent } from './project/thread/thread.component';
import { CommentComponent } from './project/comment/comment.component';
import { ContributionComponent } from './project/contribution/contribution.component';

@NgModule({
  imports: [
    CommonModule,
	BrowserModule,
	FormsModule,
	AccountRoutingModule,
	// ProjectModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [AccountService,ProjectService],
  declarations: [HeaderComponent, HomeComponent, MyProjectsComponent, ProjectItemComponent, AllProjectsComponent, SearchResultComponent,
  	ProjectHomeComponent, DescriptionComponent, ProgressionComponent, DiscussionComponent, ThreadComponent, CommentComponent, ContributionComponent
  ]
})
export class AccountModule { }
