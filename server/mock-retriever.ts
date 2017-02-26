import { Project } from './project';
import { User } from './user';
import { Thread } from './thread';
import { Comment } from './comment';
import { Progression } from './progression';
import { Contribution } from './contribution';
import Promise = require('bluebird');

let request:any = require('request-promise');

export class MockRetriever{

	/**
	 * Returns a dummy instance of a single project that houses everything: contributors, mentors, progression, contribution, thread and comments 
	 */
	buildSingleProject():Promise<Project>{

		let project = new Project();
		project.title = "Reactor Particles";
		project.tldr = "Scientific project during HackBU";
		project.description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		project.techStack = ["node", "angular", "express"];
		
		return this.retrieveRandomUser(15).then((results:any)=>{
			for(let i:number = 0; i < 3; i++){
				let user = this.parseUser(results[i]);
				project.threads[i] = this.retrieveThread(`update number ${ i }451`, results); //11-14
			} //0-2
			project.progression = this.retrieveProgression(results); //3-5
			for(let i:number = 6; i < 10; i++){
				let user = this.parseUser(results[i]);
				project.contributorList[i-6] = user;
			} //6-9
			project.mentorList[0] = this.parseUser(results[10]); //10
			return Promise.resolve(project);
		});

	}

	private retrieveContribution(addition: string, user:User): Contribution {
		let contribution = new Contribution();
		contribution.message = `I added authentication on file ${ addition }`;
		contribution.user = user;
		contribution.date = new Date();
		return contribution;
	}

	private retrieveProgression(users:any): Progression {
		let progression = new Progression();
		for(let i:number = 3; i < 6; i++){
			progression.updates[i-3] = this.retrieveContribution(`${ i }789`, users[i]);
		}
		return progression;
	}

	private retrieveComment(sufix: string, user:User): Comment {
		let comment = new Comment();
		comment.message = `Try rolling back to before the update ${ sufix }`;
		comment.user = user;
		return comment;
	}

	private retrieveThread(sufix: string, users:any): Thread {
		let thread = new Thread();
		thread.title = `Loop won't work during ${ sufix }`;
		thread.description = "My for each loop stopped working after the last update number 3489";
		thread.poster = users[11];
		for(let i:number = 12; i < 15; i++){
			let user = this.parseUser(users[i]);
			thread.commentList[i-12] = this.retrieveComment(`number ${ i }829`, user);
		}
		return thread;
	}

	/*private retrieveUser(sufix: string): User {
		let user = new User();
		user.firstName = `Jon ${ sufix }`;
		user.lastName = "Brown";
		user.fullPhotoUrl = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.mediumPhotoUrl = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.thumbnailUrl = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.points = 5.2;
		user.gender = "Female";
		user.email = "email@mail.com";
		user.password = "pass1234";
		return user;
	}*/

	private retrieveRandomUser(results:number):Promise<any> {

		let options:any = {
			uri: 'https://randomuser.me/api/',
			qs: {
				results: results,
				exc: 'location,dbo,registered,phone,cell,id,nat'
			},
			json: true
		}

		return request(options).then(function(results: any){
			return Promise.resolve(results.results);
		}).catch(function(error: any){
			console.log(error);
		});
	}

	private parseUser(result:any):User{
		let user = new User();
		user.firstName = result.name.first;
		user.lastName = result.name.last;
		user.fullPhotoUrl = result.picture.large;
		user.mediumPhotoUrl = result.picture.medium;
		user.thumbnailUrl = result.picture.thumbnail;
		user.points = Math.random() * (11 - 0) + 0;
		user.gender = result.gender;
		user.email = result.email;
		user.password = result.login.password;
		return user;
	}
}