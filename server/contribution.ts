import { User } from './user';

/** Contribution describes the body of work done by a user */
export class Contribution{
	message:string;
	user:User;
	timestamp:Date;
}