import { Injectable } from '@angular/core';
import {ModalService} from './modal.service';
import {Router} from '@angular/router';
import {FTSession} from '../classes/FTSession';
import {Course} from '../classes/course';
import {AnnouncerService} from './announcer.service';
import {Entry} from '../classes/entry';
import {Comment} from '../classes/comment';
import {User} from '../classes/user';
import {ChatConversation} from '../classes/chat-conversation';
import {FTChatAdapter} from '../adapter/f-t-chat-adapter';
import {NotificationType} from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private modalService: ModalService,
              private announcerService: AnnouncerService,
              private router: Router) { }

  notify(message){
    const keys = Object.keys(message);
    const messageType = message.type;

    // course invitation notification
    if (messageType === NotificationType.COURSE_INVITATION) {
      const course: Course = message.course;
      this.announcerService.announceCourseAdded(course);
      this.modalService.newNotificationModal( `You have been invited to the course: ${course.title}`, () => {
        this.router.navigate(['/courses/' + course.id + '/1'])
      })
    }

    // session started notification
    if(messageType === NotificationType.SESSION_STARTED){
      const session: FTSession = message.session;
      const course: Course = message.sessionCourse;
      this.modalService.newNotificationModal(`The session: ${session.description} has just started!`,  () => {
        this.router.navigate(['/session/' + course.id + '/' + session.id])
      })
    }

    // comment reply notification
    if(messageType === NotificationType.COMMENT_REPLY){
      const comment: Comment = message.comment;
      const replier: User = message.replier;
      const commentCourse: Course = message.commentCourse;
      const commentEntry: Entry = message.commentEntry;
      this.announcerService.announceCourseRefresh(commentCourse);
      this.modalService.newNotificationModal(`${replier.name} just replied to your comment!`,() => {
        this.router.navigate([`/courses/${commentCourse.id}/2/${commentEntry.id}`])
      });
    }

    // new comment in your entry notification
    if(messageType === NotificationType.COMMENT_IN_ENTRY){
      const entry: Entry = message.entry;
      const userCommenting: User = message.userCommenting;
      const commentCourse: Course = message.commentCourse;
      this.announcerService.announceCourseRefresh(commentCourse);
      this.modalService.newNotificationModal(`${userCommenting.name} just commented in your entry!`,() => {
        this.router.navigate([`/courses/${commentCourse.id}/2/${entry.id}`])
      });
    }

    if(messageType === NotificationType.CHAT_MESSAGE){
      const conversation: ChatConversation = message.chatConversation;
      this.announcerService.announceNewMessageInChat(conversation);
    }
  }

}
