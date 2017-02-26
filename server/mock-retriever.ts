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
	buildSingleProject():Project{

		let project = new Project();
		project.title = "Reactor Particles";
		project.tldr = "Scientific project during HackBU";
		project.description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		project.techStack = ["node", "angular", "express"];
		project.progression = this.retrieveProgression();
		for(let i:number = 0; i < 3; i++){
			project.threads[i] = this.retrieveThread(`update number ${ i }451`);
		}
		for(let i:number = 0; i < 4; i++){
			project.contributorList[i] = this.retrieveUser("Luis the " + i);
		}
		project.mentorList[0] = this.retrieveUser("Jake");
		project.threads

		return project;//TODO return a full project with everytinng configured
	}

	private retrieveContribution(addition: string): Contribution {
		let contribution = new Contribution();
		contribution.message = `I added authentication on file ${ addition }`;
		contribution.user = this.retrieveUser("Eric");
		contribution.date = new Date();
		return contribution;
	}

	private retrieveProgression(): Progression {
		let progression = new Progression();
		for(let i:number = 0; i < 6; i++){
			progression.updates[i] = this.retrieveContribution(`${ i }789`);
		}
		return progression;
	}

	private retrieveComment(sufix: string): Comment {
		let comment = new Comment();
		comment.message = `Try rolling back to before the update ${ sufix }`;
		comment.user = this.retrieveUser("Garred");
		return comment;
	}

	private retrieveThread(sufix: string): Thread {
		let thread = new Thread();
		thread.title = `Loop won't work during ${ sufix }`;
		thread.description = "My for each loop stopped working after the last update number 3489";
		thread.poster = this.retrieveUser("Gordon");
		for(let i:number = 0; i < 6; i++){
			thread.comments[i] = this.retrieveComment(`number ${ i }829`);
		}
		return thread;
	}

	private retrieveUser(sufix: string): User {
		let user = new User();
		user.firstname = `Jon ${ sufix }`;
		user.lastname = "Brown";
		user.fullPhotoUrl = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.mediumPhotoUrl = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.thumbnail = "https://cdn1.iconfinder.com/data/icons/freeline/32/account_friend_human_man_member_person_profile_user_users-256.png";
		user.points = 5.2;
		user.gender = "Female";
		user.email = "email@mail.com";
		user.password = "pass1234";
		return user;
	}

	retrieveRandomUser():Promise<User> {

		let options:any = {
			uri: 'https://randomuser.me/api/',
			qs: {
				results: 1,
				exc: 'location,dbo,registered,phone,cell,id,nat'
			},
			json: true
		}

		return request(options).then(function(results: any){
			let user = new User();

			user.firstname = results[0].name.first;
			user.lastname = results[0].name.last;
			user.fullPhotoUrl = results[0].picture.large;
			user.mediumPhotoUrl = results[0].picture.medium;
			user.thumbnail = results[0].picture.thumbnail;
			user.points = 5.2;
			user.gender = results[0].gender;
			user.email = results[0].email;
			user.password = results[0].login.password;

			return Promise.resolve(user);
		}).catch(function(error: any){
			console.log(error);
		});

		/*https.get("https://randomuser.me/api/?results=1&exc=location,dbo,registered,phone,cell,id,nat", function(response){
			if(response.statusCode == 200){
				let body:string = '';
				response.on('data', function (info) {
					body += info;
				});
				response.on('end', function () {
					let result:string = JSON.parse(body);
				});
			}
		}).on('error', function (e) {
			console.log(e.message);
		});*/
	}
}