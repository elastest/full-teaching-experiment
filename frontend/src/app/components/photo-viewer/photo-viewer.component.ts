import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {File} from '../../classes/file';
import {FileService} from '../../services/file.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {Course} from '../../classes/course';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit {

  constructor(private fileService: FileService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.file = this.data['file'];
    this.course = this.data.course;
  }

  public file: File;
  private blob: Blob;
  private course: Course;
  private url: string;

  @ViewChild('image') image: ElementRef<HTMLImageElement>;

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.fileService.downloadFileAsBlob(this.course.id, this.file, (blob) => {
      this.blob = blob;
      this.url = URL.createObjectURL(blob);
      this.image.nativeElement.src = this.url;
    })
  }

  downloadPicture() {
    saveAs(this.blob, this.file.name);
  }
}
