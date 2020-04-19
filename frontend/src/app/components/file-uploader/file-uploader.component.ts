import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileService} from "../../services/file.service";
import {FilesEditionService} from "../../services/files-edition.service";
import {AttachmentType} from "../../classes/attachment-type";
import {FileType} from "../../enum/file-type.enum";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  attachmentTypes = [
    new AttachmentType('web-link', FileType.LINK),
    new AttachmentType('pdf', FileType.PDF),
    new AttachmentType('video', FileType.VIDEO)
  ];

  ngOnInit(): void {
  }

  formData: FormData = new FormData();
  fileToUpload: File = null;
  uploadFg: FormGroup;
  linkFg: FormGroup;

  constructor(public fileService: FileService,
              private filesEditionService: FilesEditionService,
              private modalService: ModalService,
              private formBuilder: FormBuilder) {

    // form controls for name and type
    this.uploadFg = this.formBuilder.group({
      typeCtrl: ['', [Validators.required]]
    });

    // form controls for links
    this.linkFg = this.formBuilder.group({
      linkCtrl: ['', [Validators.required]]
    })
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }


  private postFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.set('file', fileToUpload, fileToUpload.name);
    let course = this.filesEditionService.courseForUpload;
    let fg = this.filesEditionService.fileGroupForUpload;
    this.fileService.uploadFile(course.id, fg.id, formData, this.uploadFg.get('typeCtrl').value.typeId).subscribe(data => {
        this.filesEditionService.announceFileSuccessfullyUploaded(course, fg);
        console.log(data);
        this.modalService.newToastModal('Attachment successfully uploaded!');
      },
      error => {
        console.log(error)
      });
  }

  submit() {
    this.postFile(this.fileToUpload)
  }

  getAttachmentTypeSelected(): AttachmentType {
    return this.uploadFg.get('typeCtrl').value;
  }

  isLink(): boolean {
    let type = this.getAttachmentTypeSelected();
    if(type){
      return type.typeId === FileType.LINK;
    }
    else{
      return false;
    }
  }

  isFile(): boolean {
    if(this.uploadFg.valid){
      return !this.isLink();
    }
    return false;
  }

  uploadButtonEnabled(): boolean {
    if (!this.uploadFg.valid) {
      return false;
    }

    if(this.isLink()){
      return this.linkFg.valid;
    }

    else{
      return this.uploadFg.valid && !!this.fileToUpload;
    }
  }

  showFileUploader(): boolean {
    let type = this.uploadFg.get('typeCtrl').value;
    if (type) {
      return type.typeId === FileType.PDF || type.typeId === FileType.VIDEO;
    }
    return false;
  }

  showLinkInput(): boolean {
    let type = this.uploadFg.get('typeCtrl').value;
    if (type) {
      return type.typeId === FileType.LINK;
    }
    return false;
  }

}
