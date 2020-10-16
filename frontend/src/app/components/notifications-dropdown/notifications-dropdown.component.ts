import {Component, OnInit} from '@angular/core';
import {Notification} from '../../classes/notification';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationService} from '../../services/notification.service';
import {CourseInvitationNotification} from '../../classes/course-invitation-notification';
import {ReplyNotification} from '../../classes/reply-notification';
import {CommentNotification} from '../../classes/comment-notification';
import {SessionStartedNotification} from '../../classes/session-started-notification';
import {Router} from '@angular/router';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-notifications-dropdown',
  templateUrl: './notifications-dropdown.component.html',
  styleUrls: ['./notifications-dropdown.component.css']
})
export class NotificationsDropdownComponent implements OnInit {

  public notifications: Notification[] = [];

  public showDropDown: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private announcerService: AnnouncerService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.authenticationService.checkLoggedIn()
      .then(() => {
        this.init();
        this.announcerService.notificationAnnouncer$.subscribe(() => {
          this.clear();
          this.init();
        })
      })
  }

  public toggleDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  private clear(): void {
    this.notifications = [];
  }

  private init(): void {
    this.notificationService.getAllNotifications()
      .subscribe(data => {
        data.forEach(notification => {
          console.log(notification)
          switch (notification.type) {
            case 'INVITED_TO_COURSE':
              this.notifications.push(new CourseInvitationNotification(notification.id, notification.message, notification.user, notification['course']));
              break;
            case 'NEW_REPLY':
              this.notifications.push(new ReplyNotification(notification.id, notification.message, notification.user, notification['entry'], notification['comment'], notification['course']));
              break;
            case 'NEW_COMMENT_IN_ENTRY':
              this.notifications.push(new CommentNotification(notification.id, notification.message, notification.user, notification['entry'], notification['comment'], notification['course']));
              break
            case 'SESSION_STARTED':
              this.notifications.push(new SessionStartedNotification(notification.id, notification.message, notification.user, notification['session'], notification['course']));
              break;
            default:
              break;
          }
        });
        console.log(this.notifications)
      });
  }

  public clickOutside() {
    if (this.showDropDown) {
      console.log(`Toggling off dropdown`)
      this.toggleDropDown();
    }
  }

  public seeAll(): void {
    this.toggleDropDown();
    this.notificationService.seeAll()
      .subscribe(resp => {
        this.notifications = [];
      }, error => {
        console.log(error);
      });
  }

  dismissNotification(notification: Notification): void {
    // remove notification from view
    this.notifications = this.notifications.filter(n => n.id !== notification.id);

    // remove notification from server
    this.notificationService.deleteNotification(notification);

    if(this.notifications.length < 1) {
      this.toggleDropDown();
    }
  }

  openNotification(notification: Notification): void {
    // remove it
    this.dismissNotification(notification);

    // disable notifications dropdown
    this.toggleDropDown();

    if (notification instanceof SessionStartedNotification) {
      const sessionStartedNotification = notification as SessionStartedNotification;
      const session = sessionStartedNotification.session;
      const course = sessionStartedNotification.course;
      this.router.navigate(['/session/' + course.id + '/' + session.id])
    }

    if (notification instanceof CommentNotification) {
      const commentNotification = notification as CommentNotification;
      const commentCourse = commentNotification.course;
      const commentEntry = commentNotification.entry;
      this.router.navigate([`/courses/${commentCourse.id}/2/${commentEntry.id}`])
    }

    if (notification instanceof ReplyNotification) {
      const commentNotification = notification as ReplyNotification;
      const commentCourse = commentNotification.course;
      const commentEntry = commentNotification.entry;
      this.router.navigate([`/courses/${commentCourse.id}/2/${commentEntry.id}`])
    }

    if (notification instanceof CourseInvitationNotification) {
      const courseInvitationNotification = notification as CourseInvitationNotification;
      const course = courseInvitationNotification.course;
      this.router.navigate(['/courses/' + course.id + '/0'])
    }
  }
}
