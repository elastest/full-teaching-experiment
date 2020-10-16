import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {Course} from '../../classes/course';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {


  public userCourses: Array<Course> = new Array<Course>();

  constructor(private courseService: CourseService,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.checkLoggedIn()
      .then(() => {
        let user = this.authenticationService.getCurrentUser();
        console.log(`Successfully logged as ${user.name}`)
        if (user) {
          this.courseService.getCourses(user).subscribe(resp => {
            this.userCourses = resp;
          });
        }
      })
      .catch((e) => {
        console.warn(`Error in the login check of the dashboard: `, e);
      });
  }
}
