import { User } from './user';
import { Thread } from './thread';
import { Progression } from './progression';

export class Project{
	/**Main project title */
	title:string;
	/** this is the TLDR one liner for the project */
	tldr:string;
	/**Long full description. Probably markdown */
	description:string;
	contributorList:User[]=[]
	mentorList:User[]=[];
	progression:Progression;
	techStack:string[]=[];
	threads:Thread[]=[];
}