import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {AnnouncerService} from '../../services/announcer.service';
import {AttachmentType} from '../../classes/attachment-type';
import {FileType} from '../../enum/file-type.enum';
import {ModalService} from '../../services/modal.service';
import {FileGroup} from '../../classes/file-group';
import {Course} from '../../classes/course';
import {File as FTFile} from '../../classes/file';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  attachmentTypes = [
    new AttachmentType('web-link', FileType.LINK),
    new AttachmentType('file', FileType.FILE),
    new AttachmentType('video', FileType.VIDEO)
  ];

  ngOnInit(): void {
  }

  formData: FormData = new FormData();
  fileToUpload: File = null;

  uploadFg: FormGroup;
  linkFg: FormGroup;

  private fileGroup: FileGroup;
  private course: Course;

  constructor(public fileService: FileService,
              private announcerService: AnnouncerService,
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

    this.announcerService.prepareFileUploadAnnouncer$.subscribe(upload => {
      this.course = upload.course;
      this.fileGroup = upload.fg;
    })
  }

  private postLinkFile(){
    const link: string = this.linkFg.get('linkCtrl').value;
    const file: FTFile = new FTFile(FileType.LINK, link, link);
    this.fileService.uploadWebLink(this.course.id, this.fileGroup.id, file)
      .subscribe(resp => {
        console.log(resp);
        this.fileGroup.files.push(file);
        this.modalService.newToastModal(`Link added successfully!`);
      }, error => {
        console.log(error);
        this.modalService.newErrorModal(`Error adding link!`, '', null);
      })

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }


  private postFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.set('file', fileToUpload, fileToUpload.name);

    this.fileService.uploadFile(this.course.id, this.fileGroup.id, formData, this.uploadFg.get('typeCtrl').value.typeId).subscribe(data => {
        this.fileGroup = data;
        this.announcerService.announceFileSuccessfullyUploaded(this.course, this.fileGroup);
      },
      error => {
        console.log(error)
      });
  }

  submit() {
    if(!this.isLink()) {
      this.postFile(this.fileToUpload)
    }
    else{
      this.postLinkFile();
    }
  }

  getAttachmentTypeSelected(): AttachmentType {
    return this.uploadFg.get('typeCtrl').value;
  }

  isLink(): boolean {
    let type = this.getAttachmentTypeSelected();
    if (type) {
      return type.typeId === FileType.LINK;
    } else {
      return false;
    }
  }

  isFile(): boolean {
    if (this.uploadFg.valid) {
      return !this.isLink();
    }
    return false;
  }

  uploadButtonEnabled(): boolean {
    if (!this.uploadFg.valid) {
      return false;
    }

    if (this.isLink()) {
      return this.linkFg.valid;
    } else {
      return this.uploadFg.valid && !!this.fileToUpload;
    }
  }

  showFileUploader(): boolean {
    let type = this.uploadFg.get('typeCtrl').value;
    if (type) {
      return type.typeId === FileType.FILE || type.typeId === FileType.VIDEO;
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
