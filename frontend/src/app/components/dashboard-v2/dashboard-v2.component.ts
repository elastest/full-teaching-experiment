import { Component, OnInit } from '@angular/core';
import {CourseService} from "../../services/course.service";
import {Course} from "../../classes/course";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {


  public userCourses: Array<Course> = new Array<Course>();

  constructor(private courseService: CourseService,
              private authService: AuthenticationService) { }

  ngOnInit() {
    let user = this.authService.getCurrentUser();

    if(user) {
      this.courseService.getCourses(user).subscribe(resp => {
        this.userCourses = resp;
      });
    }
  }

}
