export class UserChatView {
  id: number;
  nickName: string;
  name: string;
  unseenMessages: number;
  picture: string;

  constructor(id: number, nickName: string, name: string, unseenMessages: number) {
    this.id = id;
    this.nickName = nickName;
    this.name = name;
    this.unseenMessages = unseenMessages;
  }
}
