import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	private projectCategory:number=1;
	constructor() { }

	ngOnInit() {
	}

	/** Called on change or radio button. Can't use ngModel because it doesn't set on initializaiton */
	setProjectCategory(option:number){
		this.projectCategory=option;
	}

}
