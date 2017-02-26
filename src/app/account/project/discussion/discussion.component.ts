import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../models/project';
import { Thread } from '../../../../models/thread';
import { Input,Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../helpers/project.service';


@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

	threadList:Thread[];

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
		this.projectService.getDiscussion("#34:23").subscribe((threadList:Thread[])=>{
			console.debug("received thread list of length  "+threadList.length);
			this.threadList=threadList;
		});
	}

}
