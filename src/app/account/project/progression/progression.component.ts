import { Component, OnInit } from '@angular/core';
import { Progression } from '../../../../models/progression'
import { Input,Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../helpers/project.service';

@Component({
  selector: 'app-progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.scss']
})
export class ProgressionComponent implements OnInit {

	progression:Progression;

	constructor(
		private router:Router,
		private projectService:ProjectService
	) { }

	ngOnInit() {
		this.projectService.getProgression("#34:23").subscribe((progression:Progression)=>{
			console.debug("received progression of length  "+progression.updates.length);
			this.progression=progression;
		});
	}
}
