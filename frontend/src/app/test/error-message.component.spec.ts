import {TestBed} from '@angular/core/testing';

import {AppComponent} from '../app.component';

import {routing} from '../app.routing';
import {FooterComponent} from '../components/footer/footer.component';
import {PresentationComponent} from '../components/presentation/presentation.component';
import {SettingsComponent} from '../components/settings/settings.component';
import {ErrorMessageComponent} from '../components/error-message/error-message.component';
import {CommentComponent} from '../components/comment/comment.component';
import {FileGroupComponent} from '../components/file-group/file-group.component';
import {VideoSessionComponent} from '../components/video-session/video-session.component';
import {FileUploaderComponent} from '../components/file-uploader/file-uploader.component';
import {StreamComponent} from '../components/video-session/stream.component';
import {ChatLineComponent} from '../components/chat-line/chat-line.component';
import {CalendarComponent} from '../components/calendar/calendar.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import {MaterializeModule} from 'ngx-materialize';

describe('Component: ErrorMessage', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        routing,
        MaterializeModule,
      ],
      declarations: [

        AppComponent,
        PresentationComponent,
        FooterComponent,
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

  it('should create an instance', () => {
    let component = new ErrorMessageComponent();
    expect(component).toBeTruthy();
  });
});
