import {Injectable} from '@angular/core';
import {File} from '../classes/file';
import {MatDialog} from '@angular/material/dialog';
import {VideoPlayerComponent} from '../components/video-player/video-player.component';
import {HttpClient} from '@angular/common/http';
import {AnnouncerService} from './announcer.service';
import {NoopScrollStrategy} from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {

  constructor(private dialog: MatDialog) {
  }

  startPlayingVideo(file: File) {
    const ref = this.dialog.open(VideoPlayerComponent, {
      width: '500vh',
      data: {
        file: file
      },
      closeOnNavigation: false,
      hasBackdrop: false,
      autoFocus: false,
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: 'video-dialog'
    });

    ref.afterClosed().subscribe(() => {
      console.log('Closing video');
    });
  }
}
