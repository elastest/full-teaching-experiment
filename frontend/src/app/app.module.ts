import {routing} from './app.routing';

import {InterventionAskedPipe} from './pipes/intervention-asked.pipe';

import {AppComponent} from './app.component';
import {FooterComponent} from './components/footer/footer.component';
import {PresentationComponent} from './components/presentation/presentation.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ErrorMessageComponent} from './components/error-message/error-message.component';
import {CommentComponent} from './components/comment/comment.component';
import {FileGroupComponent} from './components/file-group/file-group.component';
import {FileUploaderComponent} from './components/file-uploader/file-uploader.component';
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
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {LoginComponent} from './components/login/login.component';
import {IndexPageComponent} from './components/index-page/index-page.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {RegisterComponent} from './components/register/register.component';
import {InterceptorService} from './services/interceptor.service';
import {CookieService} from 'ngx-cookie-service';
import {DashboardV2Component} from './components/dashboard-v2/dashboard-v2.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {ModalService} from './services/modal.service';
import {CoursesListComponent} from './components/courses-list/courses-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {CourseDetailsV2Component} from './components/course-details-v2/course-details-v2.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {CourseIndexComponent} from './components/course-index/course-index.component';
import {CourseDetailsSessionsComponent} from './components/course-details-sessions/course-details-sessions.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {ForumComponent} from './components/forum/forum.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {CourseAttachmentsComponent} from './components/course-attachments/course-attachments.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AnnouncerService} from './services/announcer.service';
import {DragDropDirective} from './directives/drag-drop.directive';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {AttendersListComponent} from './components/attenders-list/attenders-list.component';
import {AddAttendersModalComponent} from './components/add-attenders-modal/add-attenders-modal.component';
import {MatSelectModule} from '@angular/material/select';
import {CourseSessionComponent} from './components/course-session/course-session.component';
import {VideoPlayerComponent} from './components/video-player/video-player.component';
import {MatVideoModule} from 'mat-video';
import {VideoDialogToolsComponent} from './components/video-dialog-tools/video-dialog-tools.component';
import {VideoRecorderComponent} from './components/video-recorder/video-recorder.component';
import {OpenviduSessionModule} from 'openvidu-angular';
import {AudioRecorderComponent} from './components/audio-recorder/audio-recorder.component';
import {SessionDetailsComponent} from './components/session-details/session-details.component';
import {SessionCreationModalComponent} from './components/session-creation-modal/session-creation-modal.component';
import {CanvasWhiteboardModule} from 'ng2-canvas-whiteboard';
import {WebsocketService} from './services/websocket.service';
import {ProfilePictureDialogComponent} from './components/profile-picture-dialog/profile-picture-dialog.component';
import {ProfileDropdownComponent} from './components/profile-dropdown/profile-dropdown.component';
import {PdfOnlineViewerComponent} from './components/pdf-online-viewer/pdf-online-viewer.component';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {PhotoViewerComponent} from './components/photo-viewer/photo-viewer.component';
import {ChatComponent} from './components/chat/chat.component';
import {NgChatModule} from 'ng-chat';
import {AudioPlayerDialogComponent} from './components/audio-player-dialog/audio-player-dialog.component';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';

const matModules = [
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatMomentDateModule,
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    routing,
    matModules,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatTabsModule,
    AngularEditorModule,
    MatDatepickerModule,
    SweetAlert2Module.forRoot(),
    MatTooltipModule,
    MatGridListModule,
    MatExpansionModule,
    DragDropModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatVideoModule,
    OpenviduSessionModule,
    CanvasWhiteboardModule,
    NgxExtendedPdfViewerModule,
    NgChatModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  exports: [
    matModules
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
    FileUploaderComponent,
    ChatLineComponent,
    InterventionAskedPipe,
    LoginComponent,
    IndexPageComponent,
    RegisterComponent,
    DashboardV2Component,
    NavigationComponent,
    CoursesListComponent,
    CourseDetailsV2Component,
    CourseIndexComponent,
    CourseDetailsSessionsComponent,
    ForumComponent,
    CourseAttachmentsComponent,
    DragDropDirective,
    ChangePasswordComponent,
    AttendersListComponent,
    AddAttendersModalComponent,
    CourseSessionComponent,
    VideoPlayerComponent,
    VideoDialogToolsComponent,
    VideoRecorderComponent,
    AudioRecorderComponent,
    SessionDetailsComponent,
    SessionCreationModalComponent,
    ProfilePictureDialogComponent,
    ProfileDropdownComponent,
    PdfOnlineViewerComponent,
    PhotoViewerComponent,
    ChatComponent,
    AudioPlayerDialogComponent,
  ],
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
    ModalService,
    AnnouncerService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
