import { Component, OnInit } from '@angular/core';
import {FTChatAdapter} from '../../adapter/f-t-chat-adapter';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public adapter: FTChatAdapter) { }

  ngOnInit(): void {
  }

  messageSeen(event){
    console.log(event);
  }

}
