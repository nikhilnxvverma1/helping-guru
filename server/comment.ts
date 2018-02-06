import { User } from './user';
/** Comment by a user on a particular topic */
export class Comment{
	message:string;
	timestamp:Date;
	user:User;
}