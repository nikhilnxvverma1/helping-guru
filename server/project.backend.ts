import ojs= require('orientjs');
import winston=require('winston');
import Promise=require('bluebird');

export class ProjectBackend{

	constructor(private db:ojs.Db){
	}

	checkAndCreateNewProject(project:any):Promise<number>{
		return this.db.select().from('Project').where({
			title: project.title
		}).all().then((records:any[])=>{
			if(records.length>0){
				return 2;//Project name already taken
			}else{
				return this.insertNewProject(project);
			}
		}).catch((error:Error)=>{
			winston.error("Project retrieval : "+error.message);
			return 1;//InternalServerError
		})
	}

	private insertNewProject(project:any):Promise<number>{
 		return this.db.insert().into('Project').set({
			title:project.title,
			tldr:project.tldr,
			description:project.description,
			mediumPhotoUrl:project.mediumPhotoUrl,
			headerUrl:project.headerUrl,
		}).one().then(()=>{
			return 0;//success
		}).catch((error:Error)=>{
			winston.error("New Project insertion: "+error.message);
			return 1;
		})
	}
}