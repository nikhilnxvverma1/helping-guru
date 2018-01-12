import express = require('express');
import http = require('http');
import https = require('https');
import path = require('path');
import orientjs = require('orientjs');
import winston = require('winston');
import bodyParser = require('body-parser');
import session = require('express-session');
import { UserBackend,AuthenticationResult,statusCodeForLogin,statusCodeForSignup } from './user.backend';
import { ProjectBackend } from './project.backend';

export class ServerApp {
    
	private app: express.Application;
	private db:orientjs.Db;
	private userBackend:UserBackend;
	private projectBackend:ProjectBackend;
    
	constructor(db?:orientjs.Db) {
		this.app = express();
		this.db=db;
		this.userBackend=new UserBackend(this.db);
		this.projectBackend=new ProjectBackend(this.db);
	}
    
    public setRoutes() {        //the order matters here

		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({
			extended:false
		}));
		//TODO WARNING: the secret should not be stored in code.(Dev purposes only)
		this.app.use(session({secret:"sdf923jk23asf01gasds42",saveUninitialized:true,resave:false}));

		this.configureAPIRoutes();
		
		//static resources (is amongst the main folders in the root of the project)
		this.app.use('/', express.static(path.join(__dirname, '../', 'dist')));//for one level

		//all other routes are handled by angular
		this.app.get('/*', this._homePage);//this should be in the end
	}

	private configureAPIRoutes(){

		//rough work
		this.app.get('/api/rough', (req:express.Request, res:express.Response) => {
            winston.debug("Rough work for development purposes");
            //Do rough work in this end point
           
			res.send("rough work");
			
			//--------------------------------
		});

		//create new user
		this.app.post('/api/create-user', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to create new user");
			this.userBackend.checkAndCreateNewUser((<any>req).body).
			then((attempt:number)=>{
				//respond back with an appropriate status code
				jsonHeader(res).status(statusCodeForSignup(attempt)).send(JSON.stringify(attempt));
			});
		});

		//login authentication
		this.app.post('/api/authenticate-user', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to login user");
			this.userBackend.authenticateUser((<any>req).body).
			then((result:AuthenticationResult)=>{
				//if authentic, store the user model in the session
				if(result.attempt==0){
					(<any>req).session.user=result.user;
				}
				//respond back with an appropriate status code
				jsonHeader(res).status(statusCodeForLogin(result.attempt)).send(JSON.stringify(result.attempt));
			});
		});

		this.app.get('/api/logout', (req:express.Request, res:express.Response) => {
			winston.debug("Clearing user out of session: logout user");
			(<any>req).session.user=null;
			res.send(JSON.stringify(0));
		});

		//get a single project
		this.app.get('/api/project', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving a single project");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let projectID=(<any>req).query.projectID;
				this.projectBackend.getProject(projectID).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get a project's threads
		this.app.get('/api/project/threads', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving a single project's threads");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let projectID=(<any>req).query.projectID;
				this.projectBackend.getThreadsForProject(projectID).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get the comments in a project's threads
		this.app.get('/api/project/thread/comments', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving comments in a project's thread");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let threadID=(<any>req).query.threadID;
				this.projectBackend.getCommentsForThread(threadID).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get the progression report of a project
		this.app.get('/api/project/progression', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving a single project's progression report");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let projectID=(<any>req).query.projectID;
				this.projectBackend.getProjectProgression(projectID).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get all the projects 
		this.app.get('/api/all-projects', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving all the projects");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				this.projectBackend.getAllProjects().
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get only the project for the user in session
		this.app.get('/api/my-projects', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving only logged in user's projects");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				this.projectBackend.getProjectsOfUser(loggedInUser["@rid"]).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get hints for a search term
		this.app.get('/api/search', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving projects for a selected search term");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let term=(<any>req).query.term;
				this.projectBackend.searchProjects(term).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//get the particular user (whose ID will be supplied as in the url)
		this.app.get('/api/user/:userID', (req:express.Request, res:express.Response) => {
			winston.debug("Retrieving projects for a selected search term");

			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let userID=(<any>req).params['userID']
				this.projectBackend.getUser(userID).
				then((attempt:any)=>{
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				})
			}
		});

		//create a new project
		this.app.post('/api/create-project', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to create new project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				this.projectBackend.checkAndCreateNewProject((<any>req).body,(<any>req).session.user).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//create a new thread
		this.app.post('/api/create-thread', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to create new thread under a project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.createThreadByPoster(data,(<any>req).session.user['@rid'],data["projectID"]).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//create a new post comment
		this.app.post('/api/create-comment', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to create new comment under a thread");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.createCommentByPoster(data,data["threadID"],(<any>req).session.user['@rid']).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//create a contribution
		this.app.post('/api/create-contribution', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to make a contribution to the project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.createContribution(data,data["projectID"],(<any>req).session.user['@rid']).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//join as mentor
		this.app.put('/api/project/join-mentor', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to put user as mentor of the project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.setUserAsMentor((<any>req).session.user['@rid'],data["projectID"]).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//remove as mentor
		this.app.put('/api/project/remove-mentor', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to put user as mentor of the project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.removeUserAsMentor((<any>req).session.user['@rid'],data["projectID"]).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//join as contributor
		this.app.put('/api/project/join-contributor', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to put user as contributor of the project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.setUserAsContributor((<any>req).session.user['@rid'],data["projectID"]).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})

		//remove as contributor
		this.app.put('/api/project/remove-contributor', (req:express.Request, res:express.Response) => {
			winston.debug("Attempting to put user as contributor of the project");
			let loggedInUser=(<any>req).session.user;
			if(!loggedInUser){
				res.status(401).send("user not found");
			}else{
				let data=(<any>req).body;
				this.projectBackend.removeUserAsContributor((<any>req).session.user['@rid'],data["projectID"]).
				then((attempt:any)=>{
					//respond back with an appropriate status code
					jsonHeader(res).status(attempt.code).send(JSON.stringify(attempt.response));
				});
			}
		})
	}

    public start() {//this method is called after setRoutes()

		//normalize ports by environment variables        
		let port=process.env.PORT_SANITY||3000;
		
		// http.createServer(express).listen(port);
		this.app.listen(port,()=>{
			winston.info("Server started on port "+port);
		})
	}

    private _homePage(req: express.Request, res: express.Response) {

		let pathToIndexPage:string;
		pathToIndexPage=path.join(__dirname,'../','dist/','index.html'); //amongst the main folders
		winston.log('info',"Server refreshed index file: "+pathToIndexPage);
        res.sendFile(pathToIndexPage);
    }
}

/**
 * Simple method that set the content header to be json. 
 * Returns the same response to allow chaining. 
 */
export function jsonHeader(response:express.Response):express.Response{
	response.setHeader('Content-Type', 'application/json');
	return response;
}

export function loggedIn(req:express.Request):boolean{

	return true;//TODO use this before every request
}

//TODO this variable should be externalized
const production=process.env.NODE_ENV=='production';