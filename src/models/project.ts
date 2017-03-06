import { User } from './user';
import { Thread } from './thread';
import { Progression } from './progression';

export class Project{
	rid:string;
	/**Main project title */
	title:string;
	/** this is the TLDR one liner for the project */
	tldr:string;
	/**Long full description. Probably markdown */
	description:string;
	imageUrl:string;
	contributorList:User[]=[]
	mentorList:User[]=[];
	progression:Progression;
	techStack:string[]=[];

	static dummy():Project{
		let project=new Project();
		project.title="Spam Remover";
		project.tldr="Android app to get rid of unwanted junk SMS";
		project.description="Laborum voluptate facilis. Aut magnam nisi et recusandae. Dolorem architecto sed. Iusto velit debitis quia ut. Ipsa omnis eum incidunt illum quisquam at.";
		project.imageUrl="https://dummyimage.com/300x200/aaa/555.png?text=dummy";
		return project;
	}
}