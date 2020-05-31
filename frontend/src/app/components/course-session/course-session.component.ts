import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  OpenViduLayout,
  OpenViduLayoutOptions,
  OpenviduSessionComponent,
  Publisher,
  Session,
  SessionDisconnectedEvent,
  StreamEvent,
  UserModel
} from 'openvidu-angular';
import {ActivatedRoute} from '@angular/router';
import {FTSession} from '../../classes/FTSession';
import {Course} from '../../classes/course';
import {CourseService} from '../../services/course.service';
import {VideoSessionService} from '../../services/video-session.service';

@Component({
  selector: 'app-course-session',
  templateUrl: './course-session.component.html',
  styleUrls: ['./course-session.component.css']
})
export class CourseSessionComponent implements OnInit {

  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  // Join form
  mySessionId = 'SessionA';
  myUserName = 'Participant' + Math.floor(Math.random() * 100);
  tokens: string[] = [];
  session = false;

  ftSession: FTSession;
  course: Course;

  ovSession: Session;
  ovLocalUsers: UserModel[];
  ovLayout: OpenViduLayout;
  ovLayoutOptions: OpenViduLayoutOptions;

  @ViewChild('ovSessionComponent')
  public ovSessionComponent: OpenviduSessionComponent;

  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              private videoSessionService: VideoSessionService,
              private courseService: CourseService) {
  }

  joinSession() {
    this.videoSessionService.getSessionIdAndToken(this.ftSession.id).subscribe(token => {
      this.tokens.push(token[1]);
      this.session = true;
    });
  }

  handlerSessionCreatedEvent(session: Session): void {
    console.log('SESSION CREATED EVENT', session);
    session.on('streamCreated', (event: StreamEvent) => {
      // Do something
    });

    session.on('streamDestroyed', (event: StreamEvent) => {
      // Do something
    });

    session.on('sessionDisconnected', (event: SessionDisconnectedEvent) => {
      this.session = false;
      this.tokens = [];
    });

    this.myMethod();

  }

  handlerPublisherCreatedEvent(publisher: Publisher) {
    publisher.on('streamCreated', (e) => {
      console.log('Publisher streamCreated', e);
    });
  }

  handlerErrorEvent(event): void {
    // Do something
  }

  myMethod() {
    this.ovLocalUsers = this.ovSessionComponent.getLocalUsers();
    this.ovLayout = this.ovSessionComponent.getOpenviduLayout();
    this.ovLayoutOptions = this.ovSessionComponent.getOpenviduLayoutOptions();
  }

  ngOnInit(): void {
    let sessionId: number = Number(this.route.snapshot.paramMap.get('id'));
    let courseId: number = Number(this.route.snapshot.paramMap.get('courseId'));
    this.courseService.getCourse(courseId).subscribe(data => {
        this.course = data;
        this.ftSession = this.course.sessions.find(s => s.id === sessionId);
        this.joinSession();
      },
      error => {
        console.log(error);
      })
  }
}
