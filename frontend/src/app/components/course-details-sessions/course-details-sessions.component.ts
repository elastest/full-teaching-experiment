import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../../classes/course';
import {CourseService} from '../../services/course.service';
import {AuthenticationService} from '../../services/authentication.service';
import {FTSession} from '../../classes/FTSession';
import {Router} from '@angular/router';
import {ModalService} from '../../services/modal.service';
import {SessionService} from '../../services/session.service';
import {MatDialog} from '@angular/material/dialog';
import {SessionCreationModalComponent} from '../session-creation-modal/session-creation-modal.component';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-course-details-sessions',
  templateUrl: './course-details-sessions.component.html',
  styleUrls: ['./course-details-sessions.component.css']
})
export class CourseDetailsSessionsComponent implements OnInit {

  @Input('course')
  public course: Course;

  constructor(private courseService: CourseService,
              public authenticationService: AuthenticationService,
              private modalService: ModalService,
              private sessionService: SessionService,
              private matDialog: MatDialog,
              private announcerService: AnnouncerService,
              public router: Router) {

  }

  ngOnInit() {
    this.announcerService.sessionCreatedAnnouncer$.subscribe(sessions => {
      this.course.sessions = sessions;
    });
  }

  createSession() {
    this.matDialog.open(SessionCreationModalComponent, {
      data: {
        course: this.course
      }
    })
  }


  numberToDate(d: number) {
    return new Date(d);
  }
}
