import { Project } from './project';

export class User{
	firstName:string;
	lastName:string;
	email:string;
	password:string;
	gender:string;
	thumbnailUrl:string;
	dateOfBirth:Date;
	mediumPhotoUrl:string;
	fullPhotoUrl:string;
	points:number;
	projectList:Project[]=[]

	static dummy():User{
		let user=new User();
		user.firstName="Nikhil";
		user.lastName="Verma";
		user.email="nikhilverma@madebynikhil.com";
		user.password="asdf";
		user.gender="Male";
		user.thumbnailUrl="https://robohash.org/aliasdistinctionecessitatibus.png?size=50x50&set=set1";
		user.dateOfBirth=new Date(1991,2,28);
		user.fullPhotoUrl="http://dummyimage.com/205x241.png/ff4444/ffffff";
		user.points=234;
		return user;
	}
}