import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../models/project';
import { Input,Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../helpers/project.service';
@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent implements OnInit {

	project:Project;

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
		this.projectService.getProject("#34:23").subscribe((project:Project)=>{
			console.debug("received project "+project.title);
			this.project=project;
		});
	}

}
