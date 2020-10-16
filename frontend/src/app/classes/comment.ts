import { User } from './user';

export class Comment {

  public id?: number;
  public message: string;
  public audioUrl: string;
  public date: Date;
  public replies: Comment[];
  public commentParent: Comment;
  public user: User;

  constructor(message: string, audioUrl: string, commentParent: Comment) {
    this.message = message;
    this.audioUrl = audioUrl;
    this.replies = [];
    this.commentParent = commentParent;
    this.user = null; //Backend will take care of it
  }

}
