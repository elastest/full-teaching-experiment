import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {CourseService} from "../../services/course.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Session} from "../../classes/session";
import {Router} from "@angular/router";

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
              public router: Router) {

  }

  ngOnInit() {
  }

  showEditModal(session: Session) {

  }

  numberToDate(d: number) {
    return new Date(d);
  }
}
