import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UploaderModalService {

  uploaderClosedAnnounced$: Subject<boolean>;

  constructor() {
    this.uploaderClosedAnnounced$ = new Subject<boolean>();
  }

  announceUploaderClosed(objs) {
    this.uploaderClosedAnnounced$.next(objs);
  }

}
