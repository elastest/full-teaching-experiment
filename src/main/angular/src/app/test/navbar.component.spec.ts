import {of as observableOf} from 'rxjs';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from '../app.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';


import {NavbarComponent} from '../components/navbar/navbar.component';
import {FooterComponent} from '../components/footer/footer.component';
import {LoginModalComponent} from '../components/login-modal/login-modal.component';
import {PresentationComponent} from '../components/presentation/presentation.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {CourseDetailsComponent} from '../components/course-details/course-details.component'
import {SettingsComponent} from '../components/settings/settings.component';
import {ErrorMessageComponent} from '../components/error-message/error-message.component';
import {CommentComponent} from '../components/comment/comment.component';
import {FileGroupComponent} from '../components/file-group/file-group.component';
import {VideoSessionComponent} from '../components/video-session/video-session.component';
import {FileUploaderComponent} from '../components/file-uploader/file-uploader.component';
import {StreamComponent} from '../components/video-session/stream.component';
import {ChatLineComponent} from '../components/chat-line/chat-line.component';

import {AuthenticationService} from '../services/authentication.service';
import {LoginModalService} from '../services/login-modal.service';
import {CalendarComponent} from '../components/calendar/calendar.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import {HttpClientModule} from "@angular/common/http";
import {MaterializeModule} from "ngx-materialize";


class MockAuthenticationService extends AuthenticationService {
  login(email, pass) {
    return observableOf(true);
  }
}

class MockLoginModalService extends LoginModalService {

}

export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2}
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}


describe('NavbarComponent Test', () => {

  let comp: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let de1: DebugElement;
  let el1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MaterializeModule,
        RouterTestingModule,
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
      providers: [
        {provide: AuthenticationService, useClass: MockAuthenticationService},
        {provide: LoginModalService, useClass: MockLoginModalService},
      ]
    });

    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.componentInstance;

    de1 = fixture.debugElement.query(By.css('#logo-container'));
    el1 = de1.nativeElement;

    fixture.detectChanges();
  });

  it('should display the app\'s title', () => {
    expect(comp).toBeDefined();
    expect(fixture.isStable());

    expect(el1.textContent).toContain('FullTeaching');
  });
});
