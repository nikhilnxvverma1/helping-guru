import { Component, OnInit } from '@angular/core';
import { Input,Output } from '@angular/core';
import { Project } from '../../../models/project';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

	@Input() project:Project;

	constructor() { }

	ngOnInit() {

	}
	

}
