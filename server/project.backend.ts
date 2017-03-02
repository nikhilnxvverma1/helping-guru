import ojs= require('orientjs');
import winston=require('winston');
import Promise=require('bluebird');

export class ProjectBackend{

	constructor(private db:ojs.Db){
	}

	checkAndCreateNewProject(project:any,user:any):Promise<number>{
		return this.db.select().from('Project').where({
			title: project.title
		}).all().then((records:any[])=>{
			if(records.length>0){
				return 2;//Project name already taken
			}else{
				return this.insertNewProject(project,user);
			}
		}).catch((error:Error)=>{
			winston.error("Project retrieval : "+error.message);
			return 1;//InternalServerError
		})
	}

	private insertNewProject(project:any,user:any):Promise<number>{
 		return this.db.insert().into('Project').set({
			title:project.title,
			tldr:project.tldr,
			description:project.description,
			mediumPhotoUrl:project.mediumPhotoUrl,
			headerUrl:project.headerUrl,
		}).one().then((p:any)=>{
			return this.setUserAsContributor(user["@rid"],p["@rid"]);
		}).then((b:boolean)=>{
			return b?0:1;//success only if true
		}).catch((error:Error)=>{
			winston.error("New Project insertion: "+error.message);
			return 1;
		})
	}

	setUserAsContributor(userId:string,projectId:string):Promise<boolean>{
		return this.db.query("update "+projectId+" add contributorList = "+userId)
		.then((r:any)=>{
			winston.info('user associated:', r);
			return true;
		}).catch((err:Error)=>{
			winston.error(err.message);
			return false;
		});
	}

	/** Insert a new thread under the given project by the current user*/
	createThreadByPoster(thread:any,userId:string,projectId:string):Promise<any>{
		return this.db.query("create vertex Thread set title=:title, description=:description, timestamp=sysdate(), poster="+userId,{
			params:{
				title:thread.title,
				description:thread.description
			}
		}).
		then((resultSet:any)=>{
			return this.addThreadToProject(resultSet[0],projectId);
		})
	}

	private addThreadToProject(thread:any,projectId:string):Promise<any>{
		return this.db.query("update "+projectId+" add threadList = "+thread["@rid"])
		.then((r:any)=>{
			winston.info('Added thread to project:', thread["@rid"]);
			return thread;
		}).catch((err:Error)=>{
			winston.error(err.message);
			return 1;
		});
	}

	createCommentByPoster(comment:any,threadId:string,userId:string):Promise<any>{
		return this.db.query("Create Vertex Comment Set message=:message, timestamp=sysdate(), poster="+userId,{
			params:{
				message:comment.message
			}
		}).then((resultSet:any)=>{
			return this.db.query("Update "+threadId+" add commentList = "+resultSet[0]["@rid"]).
			then((v:any)=>{
				return resultSet[0];
			})
		})
	}
}