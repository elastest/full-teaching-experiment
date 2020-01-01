import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NavbarComponent }        from '../components/navbar/navbar.component';
import { FooterComponent }        from '../components/footer/footer.component';
import { LoginModalComponent }    from '../components/login-modal/login-modal.component';
import { PresentationComponent }  from '../components/presentation/presentation.component';
import { DashboardComponent }     from '../components/dashboard/dashboard.component';
import { CourseDetailsComponent } from '../components/course-details/course-details.component'
import { SettingsComponent }      from '../components/settings/settings.component';
import { ErrorMessageComponent }  from '../components/error-message/error-message.component';
import { CommentComponent }       from '../components/comment/comment.component';
import { FileGroupComponent }     from '../components/file-group/file-group.component';
import { VideoSessionComponent }  from '../components/video-session/video-session.component';
import { FileUploaderComponent }  from '../components/file-uploader/file-uploader.component';
import { StreamComponent }        from '../components/video-session/stream.component';
import { ChatLineComponent }      from '../components/chat-line/chat-line.component';

import { CalendarComponent }      from '../components/calendar/calendar.component';
import { TimeAgoPipe }            from 'time-ago-pipe';
import {HttpClientModule} from '@angular/common/http';
import {MaterializeModule} from 'ngx-materialize';


describe('App: Ejemplo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MaterializeModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        PresentationComponent,
        DashboardComponent,
        CourseDetailsComponent,
        NavbarComponent,
        FooterComponent,
        LoginModalComponent,
        SettingsComponent,
        ErrorMessageComponent,
        CommentComponent,
        FileGroupComponent,
        CalendarComponent,
        TimeAgoPipe,
        VideoSessionComponent,
        FileUploaderComponent,
        StreamComponent,
        ChatLineComponent,
      ],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
