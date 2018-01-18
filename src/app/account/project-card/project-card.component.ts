import { Component, OnInit } from '@angular/core';
import { Input,Output } from '@angular/core';
import { Project } from '../../../models/project';

/** A visual element representing a project in the dashboard */
@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

	@Input() project:Project;

	constructor() { }

	ngOnInit() {
	}

}
