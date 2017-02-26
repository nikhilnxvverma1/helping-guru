import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http,Headers,RequestOptions,Response } from '@angular/http';
import 'rxjs/Rx';
import { Project } from '../../models/project';
import { User } from '../../models/user';

@Injectable()
export class ProjectService {

  constructor(
	  private http:Http
  ) { }

	projectForLoggedInUser():Observable<Project[]>{
		console.debug("asking server for my projects");
		return this.http.get("/api/my-projects").map((response:Response)=>{return this.toProjectList(response)});
	}

	private toProjectList(response:Response):Project[]{
		let worksheetList:Project[]=[];
		let arrayBody=response.json();

		for(let i=0;i<arrayBody.length;i++){
			worksheetList[i]=this.extractBasicProjectInfo(arrayBody[i]);
		}

		return worksheetList;
	}

	private extractBasicProjectInfo(json:any):Project{
		let project=new Project();
		project.title=json.title;
		project.tldr=json.tldr;
		return project;
	}

	private extractUserInfo(json:any):User{
		let user=new User();
		user.firstName=json.firstName;
		user.lastName=json.lastName;
		user.email=json.email;
		user.points=json.points;
		return user;
	}

}
