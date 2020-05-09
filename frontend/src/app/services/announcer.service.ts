import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {FileGroup} from '../classes/file-group';
import {Course} from '../classes/course';

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

  constructor() {
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

}
