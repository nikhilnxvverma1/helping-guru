import { Project } from './project';
import { User } from './user';

export class MockRetriever{

	/**
	 * Returns a dummy instance of a single project that houses everything: contributors, mentors, progression, contribution, thread and comments 
	 */
	buildSingleProject():Project{
		return null;//TODO return a full project with everytinng configured
	}
}