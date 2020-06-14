import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../classes/user';
import {AuthenticationService} from './authentication.service';
import {ChatMessage} from '../classes/chat-message';
import {ChatConversation} from '../classes/chat-conversation';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  private readonly url: string = '/api-chat';

  public getOptions() {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    return ({headers});
  }

  public getConversationWith(user: User) {
    return this.getConversationWithUser(user.id);
  }

  public getConversationWithUser(userId: number) {
    return this.http.get<ChatConversation[]>(`${this.url}/conversation/withuser/${userId}`);
  }

  public sendMessage(conversation: ChatConversation, message: ChatMessage) {
    return this.http.put<ChatConversation>(`${this.url}/message/conversation/${conversation.id}`, message, this.getOptions());
  }

  public getAllConversations(){
    return this.http.get<ChatConversation[]>(`${this.url}/all`, this.getOptions());
  }

}
