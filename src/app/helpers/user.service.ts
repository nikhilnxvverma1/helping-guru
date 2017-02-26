import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http,Headers,RequestOptions,Response } from '@angular/http';
import { Signup } from 'app/signup/signup';
import 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(
	  private http:Http
  ) { }

  signup(signup:Signup):Observable<boolean>{
		console.debug("posting signup to server");
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options=new RequestOptions({headers:headers});
		return this.http.post("/api/create-user",JSON.stringify(signup),options).map((res:Response)=>{return res.json()});
	}
}
