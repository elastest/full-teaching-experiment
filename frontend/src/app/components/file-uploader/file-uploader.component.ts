import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FileGroup} from "../../classes/file-group";
import {Course} from "../../classes/course";
import {FormGroup} from "@angular/forms";
import {DialogData} from "../course-attachments/course-attachments.component";
import {FileService} from "../../services/file.service";
import {FilesEditionService} from "../../services/files-edition.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {


  ngOnInit(): void {
  }

  public formData: FormData = new FormData();
  fileToUpload: File = null;

  constructor(public fileService: FileService, private filesEditionService: FilesEditionService) {
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }


  private postFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.set('file', fileToUpload, fileToUpload.name);
    let course = this.filesEditionService.courseForUpload;
    let fg = this.filesEditionService.fileGroupForUpload;
    this.fileService.uploadFile(course.id, fg.id, formData).subscribe(data => {
        this.filesEditionService.announceFileSuccessfullyUploaded(course, fg);
      },
      error => {
        console.log(error)
      });
  }

  submit() {
    this.postFile(this.fileToUpload)
  }
}
