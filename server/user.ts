import { Project } from './project';

export class User{
	firstname:string;
	lastname:string;
	thumbnail:string;
	mediumPhotoUrl:string;
	fullPhotoUrl:string;
	points:number;
	projectList:Project[]=[]
}