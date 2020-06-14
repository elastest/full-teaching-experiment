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

@Injectable({
  providedIn: 'root'
})
export class FTChatAdapter extends ChatAdapter implements IChatGroupAdapter {


  private participants: Array<IChatParticipant> = new Array<IChatParticipant>();
  private dataLoaded: boolean = false;
  private openedConversation: ChatConversation = null;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private announcerService: AnnouncerService,
              private chatService: ChatService) {
    super();

    this.announcerService.newMessageInChatAnnouncer$.subscribe(conversation => {
      this.newMessage(conversation);
    })

    this.userService.getAll()
      .subscribe(data => {
        const users = data['content'];
        this.participants = users.map(user => {
          return {
            participantType: ChatParticipantType.User,
            id: user.id,
            displayName: user.nickName,
            avatar: user.picture ? `${environment.API_URL}${user.picture}` : 'assets/images/default_session_image.png',
            status: ChatParticipantStatus.Online
          };
        });
        this.dataLoaded = true;
      }, error => {
        console.log(error);
      })
  }

  isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(this.participants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: Math.floor(Math.random() * 10)
      }

      return participantResponse;
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    // let mockedHistory: Array<Message>;

    // mockedHistory = [
    //   {
    //     fromId: MessageType.Text,
    //     toId: 999,
    //     message: 'Hi there, here is a sample image type message:',
    //     dateSent: new Date()
    //   },
    //   {
    //     fromId: 1,
    //     toId: 999,
    //     type: MessageType.Image,
    //     message: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
    //     dateSent: new Date()
    //   },
    //   {
    //     fromId: MessageType.Text,
    //     toId: 999,
    //     message: 'Type any message bellow to test this Angular module.',
    //     dateSent: new Date()
    //   },
    // ];

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
      })

    // setTimeout(() => {
    //   let replyMessage = new Message();
    //
    //   replyMessage.message = 'You have typed \'' + message.message + '\'';
    //   replyMessage.dateSent = new Date();
    //   if (isNaN(message.toId)) {
    //     let group = this.participants.find(x => x.id == message.toId) as Group;
    //
    //     // Message to a group. Pick up any participant for this
    //     let randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
    //     replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;
    //
    //     replyMessage.toId = message.toId;
    //
    //     this.onMessageReceived(group, replyMessage);
    //   } else {
    //     replyMessage.fromId = message.toId;
    //     replyMessage.toId = message.fromId;
    //
    //     let user = this.participants.find(x => x.id == replyMessage.fromId);
    //
    //     this.onMessageReceived(user, replyMessage);
    //   }
    // }, 1000);
  }

  newMessage(conversation: ChatConversation) {
    const lastMessage: ChatMessage = conversation.messages[conversation.messages.length-1];
    console.log(lastMessage)
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
}
