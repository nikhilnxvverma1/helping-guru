import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectService } from '../../helpers/project.service';
import { Project } from '../../../models/project';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

	project:Project=new Project();
	errorMessage:string;

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
	}

	createNewProject(){
		
	}

	

}
