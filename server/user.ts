import { Project } from './project';

export class User{
	rid:string;
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
	projectList:Project[]=[];
	projectsMentored:Project[]=[];
}