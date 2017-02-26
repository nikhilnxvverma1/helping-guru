import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../models/project';
import { Input,Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../helpers/project.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  	project:Project;

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
		this.projectService.getProject("#34:23").subscribe((project:Project)=>{
			console.debug("received description for project  "+project.title);
			this.project=project;
		});
	}


}
