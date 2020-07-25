import {Notification} from './notification';
import {User} from './user';
import {FTSession} from './FTSession';
import {Course} from './course';

export class SessionStartedNotification extends Notification {
  session: FTSession;

  constructor(id: number, message: string, user: User, session: FTSession, course: Course) {
    super(id, message, user, course, `A new session has started!`);
    this.session = session;
  }
}
