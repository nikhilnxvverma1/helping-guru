import { Component, OnInit } from '@angular/core';
import { LoginAttempt } from './login-attempt';
import { Router } from '@angular/router';
import { UserService } from '../helpers/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	attempt:LoginAttempt=new LoginAttempt();
	invalidUsernameOrPassword=false;

	constructor(
		private router:Router,
		private userService:UserService
	) { }

	ngOnInit() {
	}

	doLogin(){
		// call the service
		console.debug("Attempting form submit");
		this.userService.login(this.attempt).subscribe((pass:boolean)=>{
			console.debug("moving to dashboard");
			this.router.navigate(["/home/dashboard"]);
		},(error:any)=>{
			if(error.status==401 && error._body==3){
				console.log("Invalid username or password");
				this.invalidUsernameOrPassword=true;
			}else{
				console.debug("error "+error);
			}
		});
	}

}
