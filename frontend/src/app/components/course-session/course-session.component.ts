import {Component, OnInit, ViewChild} from '@angular/core';
import {OpenViduLayout, OpenViduLayoutOptions, OpenviduSessionComponent, Session, UserModel} from 'openvidu-angular';
import {Publisher} from 'openvidu-browser';
import {VideoSessionService} from '../../services/video-session.service';
import {FTSession} from '../../classes/FTSession';

@Component({
  selector: 'app-course-session',
  templateUrl: './course-session.component.html',
  styleUrls: ['./course-session.component.css']
})
export class CourseSessionComponent implements OnInit {

  private ftSession: FTSession;

  // Join form
  mySessionId = 'SessionA';
  myUserName = 'Participant' + Math.floor(Math.random() * 100);
  tokens: string[] = [];
  session = false;

  ovSession: Session;
  ovLocalUsers: UserModel[];
  ovLayout: OpenViduLayout;
  ovLayoutOptions: OpenViduLayoutOptions;

  @ViewChild('ovSessionComponent')
  public ovSessionComponent: OpenviduSessionComponent;


  constructor(private videoSessionService: VideoSessionService) {
  }

  ngOnInit(): void {
  }

  async joinSession() {

    this.videoSessionService.getSessionIdAndToken(this.ftSession.id).subscribe(token => {
      this.tokens.push(token);
      this.session = true;
    })
  }

  handlerSessionCreatedEvent(session: Session): void {


    console.log('SESSION CREATED EVENT', session);

    session.on('streamCreated', (event) => {
    });

    session.on('streamDestroyed', (event) => {
    });

    session.on('sessionDisconnected', (event) => {
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


}
