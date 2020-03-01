import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {FileGroup} from "../classes/file-group";

@Injectable()
export class FilesEditionService {

  modeEditAnnounced$: Subject<boolean>;
  fileGroupDeletedAnnounced$: Subject<number>;
  fileFilegroupUpdatedAnnounced$: Subject<number>;
  newFilegroupAnnounced$: Subject<FileGroup>;

  currentModeEdit: boolean = false;

  constructor(){
    this.modeEditAnnounced$ = new Subject<boolean>();
    this.fileGroupDeletedAnnounced$ = new Subject<number>();
    this.fileFilegroupUpdatedAnnounced$ = new Subject<any>();
    this.newFilegroupAnnounced$ = new Subject<FileGroup>();
  }

  announceModeEdit(objs){
    this.currentModeEdit = objs;
    this.modeEditAnnounced$.next(objs);
  }

  announceFileGroupDeleted(fileGroupDeletedId: number){
    this.fileGroupDeletedAnnounced$.next(fileGroupDeletedId);
  }

  announceFileFilegroupUpdated(objs){
    this.fileFilegroupUpdatedAnnounced$.next(objs);
  }


  announceNewFileGroup(newFileGroup: FileGroup) {
    this.newFilegroupAnnounced$.next(newFileGroup);
  }
}
