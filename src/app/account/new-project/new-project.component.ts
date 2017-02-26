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
	message:string;

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
	}

	createNewProject(){
		this.projectService.createNewProject(this.project).subscribe((n:number)=>{
			if(n==0){
				this.message="Project created";
			}else if(n==2){
				this.message="Project name already exists";
			}
		},(error:Error)=>{
			this.message="Some error on server, please try again later";
		});
	}

	

}
