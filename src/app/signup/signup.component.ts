import { Component, OnInit } from '@angular/core';
import { Signup } from './signup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	private signup:Signup=new Signup();

	constructor() { }

	ngOnInit() {
	}

}
