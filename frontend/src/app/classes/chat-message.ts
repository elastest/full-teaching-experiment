import {User} from './user';

export class ChatMessage {

  user: User;
  message: string;

  constructor(user: User, message: string) {
    this.user = user;
    this.message = message;
  }
}
