import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {FileGroup} from "../classes/file-group";
import {Course} from "../classes/course";

@Injectable()
export class FilesEditionService {

  modeEditAnnounced$: Subject<boolean>;
  fileGroupDeletedAnnounced$: Subject<number>;
  fileFilegroupUpdatedAnnounced$: Subject<number>;
  newFilegroupAnnounced$: Subject<FileGroup>;

  currentModeEdit: boolean = false;

  fileGroupForUpload: FileGroup;
  courseForUpload: Course;

  fileUploadedAnnouncer: Subject<{ fg: FileGroup, course: Course }>;

  constructor() {
    this.modeEditAnnounced$ = new Subject<boolean>();
    this.fileGroupDeletedAnnounced$ = new Subject<number>();
    this.fileFilegroupUpdatedAnnounced$ = new Subject<any>();
    this.newFilegroupAnnounced$ = new Subject<FileGroup>();
    this.fileUploadedAnnouncer = new Subject<{ fg: FileGroup, course: Course }>();
  }

  announceModeEdit(objs) {
    this.currentModeEdit = objs;
    this.modeEditAnnounced$.next(objs);
  }

  announceFileGroupDeleted(fileGroupDeletedId: number) {
    this.fileGroupDeletedAnnounced$.next(fileGroupDeletedId);
  }

  announceFileFilegroupUpdated(objs) {
    this.fileFilegroupUpdatedAnnounced$.next(objs);
  }


  announceNewFileGroup(newFileGroup: FileGroup) {
    this.newFilegroupAnnounced$.next(newFileGroup);
  }

  announceFileUploadModal(course: Course, fg: FileGroup) {
    this.fileGroupForUpload = fg;
    this.courseForUpload = course;
  }

  announceFileSuccessfullyUploaded(course: Course, fg: FileGroup) {
    this.fileUploadedAnnouncer.next({fg: fg, course: course});
  }

}
