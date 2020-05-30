import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AudioRecorderService} from '../../services/audio-recorder.service';
import {saveAs} from 'file-saver';
import {ModalService} from '../../services/modal.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {ForumService} from '../../services/forum.service';
import {Comment} from '../../classes/comment';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.css']
})
export class AudioRecorderComponent implements OnInit {


  @ViewChild('audioRecorded') audioRecorded: ElementRef<HTMLAudioElement>;

  private audioBlob: Blob;

  constructor(private audioRecorderService: AudioRecorderService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private forumService: ForumService,
              private modalService: ModalService) {
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

  }
}
