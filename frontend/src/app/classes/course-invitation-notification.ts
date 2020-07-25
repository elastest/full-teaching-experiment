import {Notification} from './notification';
import {User} from './user';
import {Course} from './course';

export class CourseInvitationNotification extends Notification {
  constructor(id: number, message: string, user: User, course: Course) {
    super(id, message, user, course, `New course invitation!`);
    this.course = course;
  }
}
