import {User} from './user';
import {ChatMessage} from './chat-message';

export class ChatConversation {

  id: number;
  users: User[];
  messages: ChatMessage[];

  constructor(id: number, users: User[]) {
    this.id = id;
    this.users = users;
    this.messages = [];
  }
}
