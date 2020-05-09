import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogSize} from '../../enum/dialog-size.enum';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-video-dialog-tools',
  templateUrl: './video-dialog-tools.component.html',
  styleUrls: ['./video-dialog-tools.component.css']
})
export class VideoDialogToolsComponent implements OnInit {

  @Input()
  ref: MatDialogRef<any>;

  private dialogSize: DialogSize = DialogSize.BIG;

  constructor(private announcerService: AnnouncerService) { }

  ngOnInit(): void {
  }

  toggleDialogSize() {
    if(this.dialogSize === DialogSize.BIG) {
      this.dialogSize = DialogSize.SMALL;
      this.announcerService.announceDialogChanged(DialogSize.SMALL);
    }
    else{
      this.dialogSize = DialogSize.BIG;
      this.announcerService.announceDialogChanged(DialogSize.BIG);
    }
  }

  isBig(): boolean {
    return this.dialogSize === DialogSize.BIG;
  }

  isSmall(): boolean {
    return this.dialogSize === DialogSize.SMALL;
  }

}
