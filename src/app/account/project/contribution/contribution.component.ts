import { Component, OnInit } from '@angular/core';
import { Input,Output } from '@angular/core';
import { Contribution } from '../../../../models/contribution';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss']
})
export class ContributionComponent implements OnInit {

	@Input() contribution:Contribution;
	
	constructor() { }

	ngOnInit() {
	}

}
