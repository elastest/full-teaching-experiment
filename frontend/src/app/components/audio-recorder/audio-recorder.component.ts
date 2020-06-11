import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AudioRecorderService} from '../../services/audio-recorder.service';
import {saveAs} from 'file-saver';
import {ModalService} from '../../services/modal.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {ForumService} from '../../services/forum.service';
import {Comment} from '../../classes/comment';
import {Entry} from '../../classes/entry';
import {Course} from '../../classes/course';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.css']
})
export class AudioRecorderComponent implements OnInit {


  @ViewChild('audioRecorded') audioRecorded: ElementRef<HTMLAudioElement>;
  private audioBlob: Blob;
  private parentComment: Comment;
  private entryId: number;
  private course: Course;

  constructor(private audioRecorderService: AudioRecorderService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private modalService: ModalService,
              private forumService: ForumService) {
    this.course = data.course;
    this.entryId = data['entryId'];
    this.parentComment = data['comment'];
  }

  ngOnInit(): void {
  }

  isRecording(){
    return this.audioRecorderService.isRecording;
  }

  canDownloadAudio(){
    return !!this.audioBlob;
  }

  getAudioPlayer(): HTMLAudioElement {
    return this.audioRecorded.nativeElement;
  }

  startRecord(){
    this.audioBlob = null;
    this.getAudioPlayer().src = null;
    this.audioRecorderService.recordAudio();
  }

  finishRecord() {
    if (this.audioRecorderService.isRecording) {
      this.audioRecorderService.stopRecording();
      this.audioBlob = this.audioRecorderService.exportAudio();
      this.getAudioPlayer().src = `${URL.createObjectURL(this.audioBlob)}`;
    }
  }

  downloadAudio() {
    if (this.audioBlob) {
      saveAs(this.audioBlob, 'audio.wav')
    }
  }

  sendReply() {
    this.forumService.newAudioComment(this.parentComment, this.entryId, this.course.courseDetails.id, this.audioBlob)
      .subscribe(data => {
        console.log(data);
        this.modalService.newToastModal(`Successfully added audio reply!`);
      }, err => {
        console.log(err);
        this.modalService.newErrorModal(`Error sending new audio reply!`, 'Please contact your administrator!', null);
      })
  }
}
