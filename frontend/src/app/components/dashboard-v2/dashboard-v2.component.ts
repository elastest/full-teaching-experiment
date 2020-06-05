import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {Course} from '../../classes/course';
import {AuthenticationService} from '../../services/authentication.service';
import {WebsocketService} from '../../services/websocket.service';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {


  public userCourses: Array<Course> = new Array<Course>();

  constructor(private courseService: CourseService,
              private websocketService: WebsocketService,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.checkCredentials()
      .then(() => {
        let user = this.authenticationService.getCurrentUser();
        if (user) {
          this.courseService.getCourses(user).subscribe(resp => {
            this.userCourses = resp;
          });
        }
      })
      .catch((e) => {
      });
  }

  do() {
    // this.websocketService._joinBroadcast('LOL')
  }
}
