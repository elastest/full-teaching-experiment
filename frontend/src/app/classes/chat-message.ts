import {User} from './user';

export class ChatMessage {

  user: User;
  message: string;
  dateSent: Date;
  dateSeen: Date;

  constructor(user: User, message: string) {
    this.user = user;
    this.message = message;
    this.dateSeen = null;
    this.dateSent = new Date();
  }
}
