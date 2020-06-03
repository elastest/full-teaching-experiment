import { Injectable } from '@angular/core';
import {ModalService} from './modal.service';
import {Router} from '@angular/router';
import {FTSession} from '../classes/FTSession';
import {Course} from '../classes/course';
import {AnnouncerService} from './announcer.service';

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
      this.modalService.notificationDialog(`New course invitation!`, `You have been invited to course: ${course.title}`, 'open', () => {
        this.router.navigate(['/courses/' + course.id + '/1'])
      })
    }

    // session started notification
    if(keys.includes('session')){
      const session: FTSession = message.session;
      const course: Course = message.sessionCourse;
      this.modalService.notificationDialog(`A session has started!`, `The session: ${session.description} has just started!`, 'Join', () => {
        this.router.navigate(['/session/' + course.id + '/' + session.id])
      })
    }
  }

}
