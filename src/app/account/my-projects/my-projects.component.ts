import { Component, OnInit } from '@angular/core';
import { Input,Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Project } from '../../../models/project';
import { ProjectService } from '../../helpers/project.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

	@Input() user:User;
	projectList:Project[];

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
		this.loadData(true);
	}

	loadData(dummy=false){
		if(dummy){
			this.projectList=[];
			for(let i=0;i<10;i++){
				this.projectList.push(Project.dummy());
			}
		}else{
			this.projectService.projectForLoggedInUser().subscribe((projectList:Project[])=>{
				console.debug("Received "+projectList.length+" projects from server");
				this.projectList=projectList;
			});
		}
	}

}
