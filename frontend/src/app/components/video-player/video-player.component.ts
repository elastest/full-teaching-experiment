import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {environment} from '../../../environments/environment';
import {AnnouncerService} from '../../services/announcer.service';
import {DialogSize} from '../../enum/dialog-size.enum';

@Component({
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPlayerComponent {

  url: string = environment.API_URL;

  constructor(
    public dialogRef: MatDialogRef<VideoPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private announcerService: AnnouncerService) {

    announcerService.dialogSizeChangedAnnouncer$.subscribe(size => {

      if (size === DialogSize.BIG) {
        dialogRef.updateSize('500vh');
        dialogRef.updatePosition(null);
      } else {
        dialogRef.updateSize('400px', '255px');
        dialogRef.updatePosition({right: '20px', bottom: '20px'});
      }

    })

  }


}
