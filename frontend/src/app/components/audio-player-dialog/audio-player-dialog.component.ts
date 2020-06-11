import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {Comment} from '../../classes/comment';
import {FileService} from '../../services/file.service';
import {Course} from '../../classes/course';

@Component({
  selector: 'app-audio-player-dialog',
  templateUrl: './audio-player-dialog.component.html',
  styleUrls: ['./audio-player-dialog.component.css']
})
export class AudioPlayerDialogComponent implements OnInit, AfterViewInit {

  private comment: Comment;
  private course: Course;
  private src: string = '';
  private blob: Blob;

  @ViewChild('audioComment') audioComment: ElementRef<HTMLAudioElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fileService: FileService
  ) {
    this.comment = data['comment'];
    this.course = data.course;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.fileService.downloadAudioFile(this.course.id, this.comment.id, (blob) => {
      this.blob = blob;
      this.src = URL.createObjectURL(blob);
      this.audioComment.nativeElement.src = this.src;
    })
  }
}
