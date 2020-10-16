import {User} from './user';
import {Course} from './course';

export abstract class Notification {
  id: number;
  message: string;
  title: string;
  user: User;
  date: Date;
  type: string;
  course: Course;

  protected constructor(id: number, message: string, user: User, course: Course, title: string) {
    this.id = id;
    this.message = message;
    this.user = user;
    this.title = title;
    this.course = course;
    this.date = new Date();
  }
}
