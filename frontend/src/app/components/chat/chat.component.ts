import {Component, OnInit} from '@angular/core';
import {FTChatAdapter} from '../../adapter/f-t-chat-adapter';
import {IChatParticipant, Theme} from 'ng-chat';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public adapter: FTChatAdapter,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {

  }

  messageSeen(event) {
    console.log(event);
  }

  searchUser(event: any) {
    const search = event.target.value;

  }

  openConversation(participant: IChatParticipant) {

  }

  getChatTheme() {
    return Theme.Dark;
  }
}
