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
				this.attachProgressionTo(p),
				this.setCreatorOfProject(p["@rid"],user["@rid"])
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

	private setCreatorOfProject(projectID:string,userID:string):Promise<any>{
		return this.db.query("update "+projectID+" set createdBy = "+userID+" return after @this").
		then((rs:any[])=>{
			return rs[0];
		});
	}

	private attachProgressionTo(project:any):Promise<any[]>{
		return this.db.create('vertex','Progression').one().
		then((progression:any)=>{
			return this.db.query("Update "+project['@rid']+" set progression = "+progression['@rid']+" return after @this");
		});
	}

	/** Adds the user to the contributorList of a project */
	setUserAsContributor(userID:string,projectID:string):Promise<any>{
		return this.db.query("update "+projectID+" add contributorList = "+userID+" return after @this").
		then((rp:any)=>{
			return this.db.query("update "+userID+" add projectsContributed = "+projectID+" return after @this").
			then((ru:any[])=>{
				winston.debug('user added as contributor to project:', rp[0]);
				return {code:200,response:{status:0,message:"Success",project:rp[0]}};
			});
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	/** Adds the user to the mentorList of a project */
	setUserAsMentor(userID:string,projectID:string):Promise<any>{
		return this.db.query("update "+projectID+" add mentorList = "+userID+" return after @this").
		then((rp:any)=>{
			return this.db.query("update "+userID+" add projectsMentored = "+projectID+" return after @this").
			then((ru:any[])=>{
				winston.debug('user added as mentor to project:', rp[0]);
				return {code:200,response:{status:0,message:"Success",project:rp[0]}};
			});
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	/** Removes the user from the contributorList of a project */
	removeUserAsContributor(userID:string,projectID:string):Promise<any>{
		return this.db.query("update "+projectID+" remove contributorList = "+userID+" return after @this").
		then((rp:any)=>{
			return this.db.query("update "+userID+" remove projectsContributed = "+projectID+" return after @this").
			then((ru:any[])=>{
				winston.debug('user removed as contributor from project:', rp[0]);
				return {code:200,response:{status:0,message:"Success",project:rp[0]}};
			});
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	/** Removes the user from the mentorList of a project */
	removeUserAsMentor(userID:string,projectID:string):Promise<any>{
		return this.db.query("update "+projectID+" remove mentorList = "+userID+" return after @this").
		then((rp:any)=>{
			return this.db.query("update "+userID+" remove projectsMentored = "+projectID+" return after @this").
			then((ru:any[])=>{
				winston.debug('user removed as mentor from project:', rp[0]);
				return {code:200,response:{status:0,message:"Success",project:rp[0]}};
			});
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	/** Insert a new thread under the given project by the current user*/
	createThreadByPoster(thread:any,userID:string,projectID:string):Promise<any>{
		return this.db.query("create vertex Thread set title=:title, description=:description, timestamp=sysdate(), poster="+userID,{
			params:{
				title:thread.title,
				description:thread.description
			}
		}).
		then((resultSet:any)=>{
			return this.addThreadToProject(resultSet[0],projectID);
		})
	}

	private addThreadToProject(thread:any,projectID:string):Promise<any>{
		return this.db.query("update "+projectID+" add threadList = "+thread["@rid"]+" return after @this")
		.then((r:any)=>{
			winston.info('Added thread to project:', thread["@rid"]);
			return {code:200,response:{status:0,message:"Success",thread:thread}};
		}).catch((err:Error)=>{
			winston.error(err.message);
			return {code:500,response:{status:1,message:err.message}};
		});
	}

	createCommentByPoster(comment:any,threadID:string,userID:string):Promise<any>{
		return this.db.query("Create Vertex Comment Set message=:message, timestamp=sysdate(), poster="+userID,{
			params:{
				message:comment.message
			}
		}).then((resultSet:any[])=>{
			return this.db.query("Update "+threadID+" add commentList = "+resultSet[0]["@rid"]).
			then((v:any)=>{
				return {code:200,response:{status:0,message:"Success",comment:resultSet[0]}};
			})
		}).catch((error:Error)=>{
			return {code:500,response:{status:1,message:error.message}};
		});
	}

	createContribution(contribution:any,projectID:string,userID:string):Promise<any>{
		return this.db.query("Create Vertex Contribution Set message=:message, timestamp=sysdate(), user="+userID,{
			params:{
				message:contribution.message
			}
		}).then((resultSet:any[])=>{
			let persisted=resultSet[0];
			return this.db.query("Select progression from Project where @rid= "+projectID).
			then((progressionRs:any[])=>{
				let progression=progressionRs[0].progression;//progression column of the first row
				return this.db.query("Update "+progression+" add updates = "+persisted["@rid"]).
				then((v:any)=>{
					return {code:200,response:{status:0,message:"Success",comment:persisted}};
				})
			})
			
		}).catch((error:Error)=>{
			return {code:500,response:{status:1,message:error.message}};
		});
	}

	//--------------GET requests-----------------

	/** Returns all project that the user either contributed to or mentored */
	getProjectsOfUser(userID:string):Promise<any>{
		return this.db.query("select from project where @rid in (select projectsContributed from User where @rid = "+userID+") or"+
		 " @rid in (select projectsMentored from User where @rid = "+userID+")").
		then((rs:any[])=>{
			return {code:200,response:{status:0,projectList:rs}}
		}).catch((error:Error)=>{
			return {code:500,response:{status:1}}
		});
	}

	/** Returns all the projects in the system*/
	getAllProjects():Promise<any>{
		return this.db.query("select from project").
		then((rs:any[])=>{
			return {code:200,response:{status:0,projectList:rs}}
		}).catch((error:Error)=>{
			return {code:500,response:{status:1}}
		});
	}

	/** Returns all projects matching the given term. Basically checks for match against title and tldr */
	searchProjects(term:string){
		let searchTerm = term.toLowerCase();
		return this.db.query("select from project where title.toLowerCase() like '%"+searchTerm+"%' or tldr.toLowerCase() like '%"+searchTerm+"%'").
		then((rs:any[])=>{
			return {code:200,response:{status:0,projectList:rs}}
		}).catch((error:Error)=>{
			return {code:500,response:{status:1}}
		});
	}

}