import {Notification} from './notification';
import {User} from './user';
import {Entry} from './entry';
import {Comment} from './comment';
import {Course} from './course';

export class CommentNotification extends Notification {

  entry: Entry;
  comment: Comment;

  constructor(id: number, message: string, user: User, entry: Entry, comment: Comment, course: Course) {
    super(id, message, user, course, `You have a new comment!`);
    this.entry = entry;
    this.comment = comment;
  }
}
