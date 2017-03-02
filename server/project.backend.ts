import ojs= require('orientjs');
import winston=require('winston');
import Promise=require('bluebird');

export class ProjectBackend{

	constructor(private db:ojs.Db){
	}

	checkAndCreateNewProject(project:any,user:any):Promise<any>{
		return this.db.select().from('Project').where({
			title: project.title
		}).all().then((records:any[])=>{
			if(records.length>0){
				return {code:500,response:{status:4,message:"Project name already taken"}};
			}else{
				return this.insertNewProject(project,user);
			}
		}).catch((error:Error)=>{
			winston.error("Project retrieval : "+error.message);
			return {code:500,response:{status:5,message:"Error on project retrieval "+error.message}};
		})
	}

	private insertNewProject(project:any,user:any):Promise<any>{
 		return this.db.insert().into('Project').set({
			title:project.title,
			tldr:project.tldr,
			description:project.description,
			mediumPhotoUrl:project.mediumPhotoUrl,
			headerUrl:project.headerUrl,
		}).one().then((p:any)=>{
			return Promise.all([
				this.setUserAsContributor(user["@rid"],p["@rid"]),
				this.attachProgressionTo(p)
			]);
		}).then((values:[any,any[]])=>{
			let contributionStatus=values[0].response.status;
			if(contributionStatus==0){
				let updatedProject=values[1][0];
				if(updatedProject==null){
					return {code:500,response:{status:3,message:"Could not attach progression to project"}};
				}else{
					return {code:200,response:{status:0,message:"Success",project:updatedProject}};
				}
			}else{
				return {code:500,response:{status:2,message:"User could not be set as contributor",project:project}};
			}
		}).catch((error:Error)=>{
			winston.error("New Project insertion: "+error.message);
			return {code:500,response:{status:1,message:"Error on project insertion "+error.message}};
		})
	}

	private attachProgressionTo(project:any):Promise<any[]>{
		return this.db.create('vertex','Progression').one().
		then((progression:any)=>{
			return this.db.query("Update "+project['@rid']+" set progression = "+progression['@rid']+" return after @this");
		});
	}

	/** Adds the user to the contributorList of a project */
	setUserAsContributor(userId:string,projectId:string):Promise<any>{
		return this.db.query("update "+projectId+" add contributorList = "+userId+" return after @this")
		.then((r:any)=>{
			winston.debug('user added as contributor to project:', r);
			return {code:200,response:{status:0,message:"Success",project:r[0]}};
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	/** Adds the user to the mentorList of a project */
	setUserAsMentor(userId:string,projectId:string):Promise<any>{
		return this.db.query("update "+projectId+" add mentorList = "+userId+" return after @this")
		.then((r:any)=>{
			return {code:200,response:{status:0,message:"Success",project:r[0]}};
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
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
		return this.db.query("update "+projectId+" add threadList = "+thread["@rid"]+" return after @this")
		.then((r:any)=>{
			winston.info('Added thread to project:', thread["@rid"]);
			return {code:200,response:{status:0,message:"Success",thread:thread}};
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
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
				return {code:200,response:{status:0,message:"Success",comment:resultSet[0]}};
			})
		})
	}
}