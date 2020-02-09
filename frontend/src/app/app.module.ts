import {routing} from './app.routing';

import {InterventionAskedPipe} from './pipes/intervention-asked.pipe';

import {AppComponent} from './app.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {PresentationComponent} from './components/presentation/presentation.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {CourseDetailsComponent} from './components/course-details/course-details.component'
import {SettingsComponent} from './components/settings/settings.component';
import {ErrorMessageComponent} from './components/error-message/error-message.component';
import {CommentComponent} from './components/comment/comment.component';
import {FileGroupComponent} from './components/file-group/file-group.component';
import {VideoSessionComponent} from './components/video-session/video-session.component';
import {FileUploaderComponent} from './components/file-uploader/file-uploader.component';
import {StreamComponent} from './components/video-session/stream.component';
import {ChatLineComponent} from './components/chat-line/chat-line.component';

import {AuthenticationService} from './services/authentication.service';
import {CourseService} from './services/course.service';
import {SessionService} from './services/session.service';
import {ForumService} from './services/forum.service';
import {FileService} from './services/file.service';
import {CourseDetailsModalDataService} from './services/course-details-modal-data.service';
import {LoginModalService} from './services/login-modal.service';
import {UploaderModalService} from './services/uploader-modal.service';
import {UserService} from './services/user.service';
import {AnimationService} from './services/animation.service';
import {VideoSessionService} from './services/video-session.service';

import {CalendarComponent} from './components/calendar/calendar.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {LoginComponent} from './components/login/login.component';
import {IndexPageComponent} from './components/index-page/index-page.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {RegisterComponent} from './components/register/register.component';
import {InterceptorService} from "./services/interceptor.service";
import {CookieService} from "ngx-cookie-service";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/moment";
import {DashboardV2Component} from './components/dashboard-v2/dashboard-v2.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {ModalService} from "./services/modal.service";
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import { CourseDetailsV2Component } from './components/course-details-v2/course-details-v2.component';
import {AngularEditorComponent, AngularEditorModule} from "@kolkov/angular-editor";
import { CourseIndexComponent } from './components/course-index/course-index.component';
import { CourseDetailsSessionsComponent } from './components/course-details-sessions/course-details-sessions.component';

const matModules = [
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  MatButtonModule,
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    routing,
    matModules,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatTabsModule,
    AngularEditorModule
  ],
  exports: [
    matModules
  ],
  declarations: [
    AppComponent,
    PresentationComponent,
    DashboardComponent,
    CourseDetailsComponent,
    FooterComponent,
    LoginModalComponent,
    SettingsComponent,
    ErrorMessageComponent,
    CommentComponent,
    FileGroupComponent,
    CalendarComponent,
    VideoSessionComponent,
    FileUploaderComponent,
    StreamComponent,
    ChatLineComponent,
    InterventionAskedPipe,
    LoginComponent,
    IndexPageComponent,
    RegisterComponent,
    DashboardV2Component,
    SidebarComponent,
    NavigationComponent,
    CoursesListComponent,
    CourseDetailsV2Component,
    CourseIndexComponent,
    CourseDetailsSessionsComponent],
  providers: [
    AuthenticationService,
    CourseService,
    SessionService,
    ForumService,
    FileService,
    CourseDetailsModalDataService,
    LoginModalService,
    UploaderModalService,
    UserService,
    AnimationService,
    VideoSessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    CookieService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
