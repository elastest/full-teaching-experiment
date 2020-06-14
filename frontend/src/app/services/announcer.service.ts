import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {FileGroup} from '../classes/file-group';
import {Course} from '../classes/course';
import {DialogSize} from '../enum/dialog-size.enum';
import {Comment} from '../classes/comment';
import {Entry} from '../classes/entry';
import {FTSession} from '../classes/FTSession';
import {User} from '../classes/user';
import {CourseDetails} from '../classes/course-details';
import {ChatConversation} from '../classes/chat-conversation';

@Injectable()
export class AnnouncerService {

  private editModeAnnouncerSubject: Subject<boolean> = new Subject<boolean>();
  public editModeAnnouncer$ = this.editModeAnnouncerSubject.asObservable();

  private fileGroupDeletedAnnouncerSubject: Subject<number> = new Subject<number>();
  public fileGroupDeletedAnnouncer$ = this.fileGroupDeletedAnnouncerSubject.asObservable();

  private fileInFileGroupUpdatedAnnouncerSubject: Subject<number> = new Subject<number>();
  public fileInFileGroupUpdatedAnnouncer = this.fileInFileGroupUpdatedAnnouncerSubject.asObservable();

  private fileGroupAddedAnnouncerSubject: Subject<CourseDetails> = new Subject<CourseDetails>();
  public fileGroupAddedAnnouncer = this.fileGroupAddedAnnouncerSubject.asObservable();

  private fileUploadedAnnouncerSubject: Subject<{ fg: FileGroup, course: Course }> = new Subject<{ fg: FileGroup, course: Course }>();
  public fileUploadedAnnouncer = this.fileUploadedAnnouncerSubject.asObservable();

  private prepareFileUploadAnnouncerSubject: Subject<{ fg: FileGroup, course: Course }> = new Subject<{ fg: FileGroup, course: Course }>();
  public prepareFileUploadAnnouncer$ = this.prepareFileUploadAnnouncerSubject.asObservable();

  private dialogSizeChangedAnnouncerSubject: Subject<DialogSize> = new Subject<DialogSize>();
  public dialogSizeChangedAnnouncer$ = this.dialogSizeChangedAnnouncerSubject.asObservable();

  private commentRemovedAnnouncerSubject: Subject<{entry: Entry}> = new Subject<{entry: Entry}>();
  public commentRemovedAnnouncer$ = this.commentRemovedAnnouncerSubject.asObservable();

  private sessionCreatedAnnouncerSubject: Subject<FTSession[]> = new Subject<FTSession[]>();
  public sessionCreatedAnnouncer$ = this.sessionCreatedAnnouncerSubject.asObservable();

  private courseAddedAnnouncerSubject: Subject<Course> = new Subject<Course>();
  public courseAddedAnnouncer$ = this.courseAddedAnnouncerSubject.asObservable();

  private attenderAddedToCourseAnnouncerSubject: Subject<{ course: Course, attenders: User[] }> = new Subject<{ course: Course, attenders: User[] }>();
  public attenderAddedToCourseAnnouncer$ = this.attenderAddedToCourseAnnouncerSubject.asObservable();

  private courseRefreshAnnouncerSubject: Subject<Course> = new Subject<Course>();
  public courseRefreshAnnouncer$ = this.courseRefreshAnnouncerSubject.asObservable();

  private audioCommentAddedAnnouncerSubject: Subject<{courseId: number, entryId: number, comment: Comment}> = new Subject<{courseId: number, entryId: number, comment: Comment}>();
  public audioCommentAddedAnnouncer$ = this.audioCommentAddedAnnouncerSubject.asObservable();

  private newMessageInChatAnnouncerSubject: Subject<ChatConversation> = new Subject<ChatConversation>();
  public newMessageInChatAnnouncer$ = this.newMessageInChatAnnouncerSubject.asObservable();

  constructor() {
  }

  announceNewMessageInChat(conversation: ChatConversation){
    this.newMessageInChatAnnouncerSubject.next(conversation);
  }

  announceAudioCommentAdded(courseId: number, entryId: number, comment: Comment): void {
    this.audioCommentAddedAnnouncerSubject.next({courseId: courseId, entryId: entryId, comment: comment});
  }

  announceCourseRefresh(course: Course): void {
    this.courseRefreshAnnouncerSubject.next(course);
  }

  announceAttenderAddedToCourse(course: Course, attenders: User[]){
    this.attenderAddedToCourseAnnouncerSubject.next({course: course, attenders: attenders});
  }

  announceCourseAdded(course: Course){
    this.courseAddedAnnouncerSubject.next(course);
  }

  announceSessionCreated(sessions: FTSession[]){
    this.sessionCreatedAnnouncerSubject.next(sessions);
  }

  announceDialogChanged(size: DialogSize){
    this.dialogSizeChangedAnnouncerSubject.next(size);
  }

  announceModeEdit(objs) {
    this.editModeAnnouncerSubject.next(objs);
  }

  announceFileGroupDeleted(fileGroupDeletedId: number) {
    this.fileGroupDeletedAnnouncerSubject.next(fileGroupDeletedId);
  }

  announceFileFilegroupUpdated(objs) {
    this.fileInFileGroupUpdatedAnnouncerSubject.next(objs);
  }

  announceNewFileGroup(newFileGroup: CourseDetails) {
    this.fileGroupAddedAnnouncerSubject.next(newFileGroup);
  }

  announceFileUploadModal(course: Course, fg: FileGroup) {
    this.fileUploadedAnnouncerSubject.next({
      fg: fg,
      course: course
    })
  }

  announceFileSuccessfullyUploaded(course: Course, fg: FileGroup) {
    this.fileUploadedAnnouncerSubject.next({fg: fg, course: course});
  }

  announcePrepareFileUpload(course: Course, fg: FileGroup) {
    this.prepareFileUploadAnnouncerSubject.next({course: course, fg: fg});
  }

  announceCommentRemoved(entry: Entry): void {
    this.commentRemovedAnnouncerSubject.next({entry: entry});
  }

}
