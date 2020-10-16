import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FTChatAdapter} from '../../adapter/f-t-chat-adapter';
import {IChatController, IChatParticipant, Theme} from 'ng-chat';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  private searchInput;
  
  constructor(public adapter: FTChatAdapter,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {

  }

  messageSeen(event) {
    this.adapter.messagesSeen(event);
  }

  searchUser(event: any) {
    if (event.target.id === 'ng-chat-search_friend') {
      const search: string = event.target.value;
      this.adapter.applySearch(search);
    }
  }

  getChatTheme() {
    return Theme.Dark;
  }

  ngAfterViewInit(): void {
    this.searchInput = document.getElementById('ng-chat-search_friend');
  }
}
