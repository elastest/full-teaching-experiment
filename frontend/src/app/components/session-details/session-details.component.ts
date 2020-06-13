import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FTSession} from '../../classes/FTSession';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {Course} from '../../classes/course';
import {AuthenticationService} from '../../services/authentication.service';
import {ModalService} from '../../services/modal.service';
import {SessionService} from '../../services/session.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {CanvasWhiteboardComponent, CanvasWhiteboardUpdate} from 'ng2-canvas-whiteboard';

@Component({
  selector: 'app-session-details',
  viewProviders: [CanvasWhiteboardComponent],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css'],
})
export class SessionDetailsComponent implements OnInit, AfterViewInit {

  public session: FTSession;
  public course: Course;
  @ViewChild('picker') picker: MatDatepicker<any>


  constructor(private route: ActivatedRoute,
              private modalService: ModalService,
              private courseService: CourseService,
              private sessionService: SessionService,
              private router: Router,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    let sessionId: number = Number(this.route.snapshot.paramMap.get('id'));
    let courseId: number = Number(this.route.snapshot.paramMap.get('courseId'));
    this.authenticationService.reqIsLogged()
      .then(() => {
        this.courseService.getCourse(courseId).subscribe(data => {
            this.course = data;
            this.session = this.course.sessions.find(s => s.id === sessionId);
          },
          error => {
            console.log(error);
          })
      })

  }

  today() {
    return new Date();
  }

  updateDesc() {
    this.modalService.newInputCallbackedModal(`Enter new  session description`, (resp) => {
      const value = resp.value;
      this.session.description = value;
      this.sessionService.editSession(this.session)
        .subscribe(resp => {
          console.log(resp)
          this.modalService.newToastModal(`Session description updated!`)
        }, error => {
          this.modalService.newErrorModal(`Error updating session description`, `${error}`, null);

        })
    })
  }

  updateTitle() {
    this.modalService.newInputCallbackedModal(`Enter new  session title`, (resp) => {
      const value = resp.value;
      this.session.title = value;
      this.sessionService.editSession(this.session)
        .subscribe(resp => {
          console.log(resp)
          this.modalService.newToastModal(`Session title updated!`)
        }, error => {
          this.modalService.newErrorModal(`Error updating session title`, `${error}`, null);
        })
    })
  }

  delete() {
    this.modalService.newCallbackedModal(`Are you sure about removing this session?`, () => {
      this.sessionService.deleteSession(this.session.id).subscribe(data => {
        this.modalService.newSuccessModal('Session correctly removed!', 'The session was successfully deleted', '/');
      }, error => {
        this.modalService.newErrorModal('Error removing session!', JSON.stringify(error), null);
      })

    })
  }

  myFilter = (date: Date | null): boolean => {
    const day = date.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && date > this.today();
  }

  changeDate(event) {
    const date = event.value;
    this.session.date = date.getTime();
    this.sessionService.editSession(this.session).subscribe(resp => {
      this.modalService.newToastModal(`Session date changed to: ${date}`);
    }, error => {
      this.modalService.newErrorModal('Error changing date of session!', JSON.stringify(error), null);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);

  }

  backToCourse() {
    this.router.navigate([`courses/${this.course.id}/1`])
  }

  sendBatchUpdate($event: CanvasWhiteboardUpdate[]) {

  }

  onCanvasClear() {

  }

  onCanvasRedo($event: any) {

  }

  onCanvasUndo($event: any) {

  }
}
