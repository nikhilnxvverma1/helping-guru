import { Component, OnInit } from '@angular/core';
import { Input,Output } from '@angular/core';
import { Thread } from '../../../../models/thread';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

	@Input() thread:Thread;
	
	constructor() { }

	ngOnInit() {
	}

}
