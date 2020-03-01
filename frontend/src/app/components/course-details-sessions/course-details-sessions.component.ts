import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {CourseService} from "../../services/course.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Session} from "../../classes/session";
import {Router} from "@angular/router";
import {ModalService} from "../../services/modal.service";
import {SessionService} from "../../services/session.service";

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
              public router: Router) {

  }

  ngOnInit() {
  }

  showEditModal(session: Session) {

    this.modalService.newInputCallbackedModal('New session title:', (newName) => {

      let value = newName.value;

      if (value) {

        session.title = value;

        this.sessionService.editSession(session).subscribe(resp => {

            this.modalService.newToastModal(`Session name successfully changed to: ${newName.value}`)

          },
          error => this.modalService.newErrorModal('Error ocured changing session title!', error, null));

      }

    });


  }

  numberToDate(d: number) {
    return new Date(d);
  }
}
