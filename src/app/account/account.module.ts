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
import { ProjectService } from '../helpers/project.service';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectModule } from './project/project.module';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  imports: [
    CommonModule,
	BrowserModule,
	FormsModule,
	AccountRoutingModule,
	ProjectModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [ProjectService],
  declarations: [HeaderComponent, HomeComponent, MyProjectsComponent, ProjectItemComponent, AllProjectsComponent, SearchResultComponent]
})
export class AccountModule { }
