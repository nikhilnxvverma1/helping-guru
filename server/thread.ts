import { User } from './user';
import { Comment } from './comment';

/**Discussion of the topics of a project */
export class Thread{
	title:string;
	description:string;
	timestamp:Date;
	poster:User;
	commentList:Comment[]=[];
}