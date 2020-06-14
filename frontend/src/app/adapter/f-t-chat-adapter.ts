import {
  ChatAdapter,
  ChatParticipantStatus,
  ChatParticipantType,
  Group,
  IChatGroupAdapter,
  IChatParticipant,
  Message,
  ParticipantResponse
} from 'ng-chat';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {ChatService} from '../services/chat.service';
import {ChatConversation} from '../classes/chat-conversation';
import {ChatMessage} from '../classes/chat-message';
import {User} from '../classes/user';
import {AuthenticationService} from '../services/authentication.service';
import {AnnouncerService} from '../services/announcer.service';
import {environment} from '../../environments/environment';
import {UserChatView} from '../classes/user-chat-view';

@Injectable({
  providedIn: 'root'
})
export class FTChatAdapter extends ChatAdapter implements IChatGroupAdapter {


  private participants: Array<IChatParticipant> = new Array<IChatParticipant>();
  private dataLoaded: boolean = false;
  private openedConversation: ChatConversation = null;

  constructor(private authenticationService: AuthenticationService,
              private announcerService: AnnouncerService,
              private chatService: ChatService) {
    super();

    this.announcerService.newMessageInChatAnnouncer$.subscribe(conversation => {
      this.newMessage(conversation);
    });

    this.initialLoadData();
  }

  private initialLoadData() {
    this.chatService.getAllUserChatViews()
      .subscribe(data => {
        const users = data['content'];
        this.loadData(users);
        this.dataLoaded = true;
      }, error => {
        console.log(error);
      });
  }

  loadData(users: Array<UserChatView>): void {
    this.participants = users.map(user => {
      return {
        unseenMessages: user.unseenMessages,
        participantType: ChatParticipantType.User,
        id: user.id,
        displayName: user.nickName,
        avatar: user.picture ? `${environment.API_URL}${user.picture}` : 'assets/images/default_session_image.png',
        status: ChatParticipantStatus.Online
      };
    });
  }

  isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(this.participants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: user['unseenMessages']
      }

      return participantResponse;
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    const me: User = this.authenticationService.getCurrentUser();
    console.log(`Getting chat history with: ${destinataryId}`);
    return this.chatService.getConversationWithUser(destinataryId).pipe(map(data => {
      this.openedConversation = data[0];
      return data[0].messages.map(message => {
        const from: number = message.user.id;
        let to: number;
        if (from === me.id) {
          to = destinataryId;
        } else {
          to = me.id;
        }
        return {
          fromId: from,
          toId: to,
          message: message.message,
          dateSent: new Date()
        };
      })
    }));
  }

  sendMessage(message: Message): void {
    const me: User = this.authenticationService.getCurrentUser();
    const chatMessage: ChatMessage = new ChatMessage(me, message.message);
    this.chatService.sendMessage(this.openedConversation, chatMessage)
      .subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

  newMessage(conversation: ChatConversation) {
    const lastMessage: ChatMessage = conversation.messages[conversation.messages.length - 1];
    const fromId: number = lastMessage.user.id;
    const replyMessage = new Message();
    replyMessage.fromId = fromId;
    replyMessage.message = lastMessage.message;
    replyMessage.dateSent = new Date();
    replyMessage.toId = this.authenticationService.getCurrentUser().id;

    let user = this.participants.find(x => x.id == fromId);
    this.onMessageReceived(user, replyMessage);
  }

  groupCreated(group: Group): void {
    this.participants.push(group);

    this.participants = this.participants.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1
    );

    // Trigger update of friends list
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
  }

  applySearch(search: string): void {
    if (search.length > 3) {
      this.chatService.getUserChatViewsByName(search)
        .subscribe(data => {
          const users: Array<UserChatView> = data['content'];
          this.loadData(users);
          this.listFriends().subscribe(response => {
            this.onFriendsListChanged(response);
          })
        }, error => {
          console.log(error);
        });
    } else {
      this.initialLoadData();
      this.listFriends().subscribe(response => {
        this.onFriendsListChanged(response);
      })
    }
  }

  messagesSeen(messages) {
    if(messages.length > 0) {
      const message = messages.pop();
      const from = message.fromId;
      const to = message.toId;
      this.chatService.sawMessages(from, to).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      })
    }
  }
}
