import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {FileGroup} from '../classes/file-group';
import {Course} from '../classes/course';
import {DialogSize} from '../enum/dialog-size.enum';
import {Comment} from '../classes/comment';
import {Entry} from '../classes/entry';
import {FTSession} from '../classes/FTSession';

@Injectable()
export class AnnouncerService {

  private editModeAnnouncerSubject: Subject<boolean> = new Subject<boolean>();
  public editModeAnnouncer$ = this.editModeAnnouncerSubject.asObservable();

  private fileGroupDeletedAnnouncerSubject: Subject<number> = new Subject<number>();
  public fileGroupDeletedAnnouncer$ = this.fileGroupDeletedAnnouncerSubject.asObservable();

  private fileInFileGroupUpdatedAnnouncerSubject: Subject<number> = new Subject<number>();
  public fileInFileGroupUpdatedAnnouncer = this.fileInFileGroupUpdatedAnnouncerSubject.asObservable();

  private fileGroupAddedAnnouncerSubject: Subject<FileGroup> = new Subject<FileGroup>();
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

  constructor() {
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

  announceNewFileGroup(newFileGroup: FileGroup) {
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
