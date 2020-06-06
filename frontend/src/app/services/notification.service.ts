import { Injectable } from '@angular/core';
import {ModalService} from './modal.service';
import {Router} from '@angular/router';
import {FTSession} from '../classes/FTSession';
import {Course} from '../classes/course';
import {AnnouncerService} from './announcer.service';
import {Entry} from '../classes/entry';
import {Comment} from '../classes/comment';
import {User} from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private modalService: ModalService,
              private announcerService: AnnouncerService,
              private router: Router) { }

  notify(message){
    const keys = Object.keys(message);

    // course invitation notification
    if (keys.includes('course')) {
      const course: Course = message.course;
      this.announcerService.announceCourseAdded(course);
      this.modalService.newNotificationModal( `You have been invited to the course: ${course.title}`, () => {
        this.router.navigate(['/courses/' + course.id + '/1'])
      })
    }

    // session started notification
    if(keys.includes('session')){
      const session: FTSession = message.session;
      const course: Course = message.sessionCourse;
      this.modalService.newNotificationModal(`The session: ${session.description} has just started!`,  () => {
        this.router.navigate(['/session/' + course.id + '/' + session.id])
      })
    }

    // comment reply
    if(keys.includes('comment')){
      const comment: Comment = message.comment;
      const replier: User = message.replier;
      const commentCourse: Course = message.commentCourse;
      this.modalService.newNotificationModal(`${replier.name} just replied to your comment!`,() => {
        //this.router.navigate([`/courses/${commentCourse.id}/1`])
      });
    }

    // comment reply
    if(keys.includes('entry')){
      const entry: Entry = message.entry;
      const userCommenting: User = message.userCommenting;
      this.modalService.newNotificationModal(`${userCommenting.name} just commented in your entry!`,() => {
      });
    }


  }

}
