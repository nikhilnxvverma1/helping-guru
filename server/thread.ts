import { User } from './user';
import { Comment } from './comment';

export class Thread{
	title:string;
	description:string;
	timestamp:Date;
	poster:User;
	commentList:Comment[]=[];
}