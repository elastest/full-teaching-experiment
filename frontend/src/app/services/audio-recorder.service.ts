import {Injectable} from '@angular/core';
import Microphone from '@gkt/microphone';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  private mic;
  isRecording: boolean = false;

  constructor() {
  }

  recordAudio(): void {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
      this.mic = new Microphone(stream, {
        streaming: false,
        mono: false
      });
      // start recording audio from the microphone
      this.mic.start();
      this.isRecording = true;
    });
  }

  stopRecording(): void {
    this.mic.stop();
    this.isRecording = false;
  }

  exportAudio() {
    return this.mic.export();
  }
}
