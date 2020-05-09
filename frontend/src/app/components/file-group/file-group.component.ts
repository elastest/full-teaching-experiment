import {Component, Input, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {File} from '../../classes/file';
import {FileGroup} from '../../classes/file-group';

import {FileService} from '../../services/file.service';
import {AnnouncerService} from '../../services/announcer.service';
import {CourseDetailsModalDataService} from '../../services/course-details-modal-data.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AnimationService} from '../../services/animation.service';


@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css']
})
export class FileGroupComponent implements OnInit {

  @Input()
  public fileGroup: FileGroup;

  @Input()
  public courseId: number;

  @Input()
  public depth: number;

  modeEditActive: boolean = false;

  fileGroupDeletion: boolean = false;
  arrayOfDeletions = [];

  subscription: Subscription;

  constructor(
    public fileService: FileService,
    public announcerService: AnnouncerService,
    public courseDetailsModalDataService: CourseDetailsModalDataService,
    public authenticationService: AuthenticationService,
    public animationService: AnimationService) {

    this.subscription = announcerService.editModeAnnouncer$.subscribe(
      active => {
        this.modeEditActive = active;
      });
  }

  ngOnInit() {
    this.announcerService.editModeAnnouncer$.subscribe(mode => {
      this.modeEditActive = mode;
    });
  }

  updatePostModalMode(mode: number, title: string) {
    let objs = [mode, title, null, null, this.fileGroup];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }

  updatePutdeleteModalMode(mode: number, title: string) {
    let objs = [mode, title];
    this.courseDetailsModalDataService.announcePutdeleteMode(objs);
  }

  changeUpdatedFileGroup() {
    let objs = [this.fileGroup, null];
    this.announcerService.announceFileFilegroupUpdated(objs);
  }

  changeUpdatedFile(file: File) {
    let objs = [this.fileGroup, file];
    this.announcerService.announceFileFilegroupUpdated(objs);
  }

  deleteFileGroup() {
    this.fileGroupDeletion = true;
    this.fileService.deleteFileGroup(this.fileGroup.id, this.courseId).subscribe(
      response => {
        //Only on succesful DELETE we locally delete the fileGroup sending an event to the suscribed parent component (CourseDetailsComponent)
        this.announcerService.announceFileGroupDeleted(response.id);
        this.fileGroupDeletion = false;
      },
      error => {
        this.fileGroupDeletion = false;
      }
    );
  }

  deleteFile(file: File, i: number) {
    this.arrayOfDeletions[i] = true;
    this.fileService.deleteFile(file.id, this.fileGroup.id, this.courseId).subscribe(
      response => {
        //Only on succesful delete we locally delete the file
        for (let i = 0; i < this.fileGroup.files.length; i++) {
          if (this.fileGroup.files[i].id == response.id) {
            this.fileGroup.files.splice(i, 1);
            break;
          }
        }
        this.arrayOfDeletions[i] = false;
      },
      error => {
        this.arrayOfDeletions[i] = false;
      }
    );
  }

  downloadFile(file: File) {
    this.fileService.downloadFile(this.courseId, file);
  }

  getFileExtension(fileLink: string) {
    let lastIndex = fileLink.lastIndexOf('.');
    if (lastIndex < 1) {
      return '';
    }
    return fileLink.substr(lastIndex + 1);
  }

  getColorByFile(fileLink: string) {
    let ext = this.getFileExtension(fileLink);
    switch (ext) {
      case 'docx':
        return 'rgba(41, 84, 151, 0.46)';
      case 'doc':
        return 'rgba(41, 84, 151, 0.46)';
      case 'xlsx':
        return 'rgba(32, 115, 71, 0.46)';
      case 'xls':
        return 'rgba(32, 115, 71, 0.46)';
      case 'ppt':
        return 'rgba(208, 71, 39, 0.46)';
      case 'pptx':
        return 'rgba(208, 71, 39, 0.46)';
      case 'pdf':
        return 'rgba(239, 15, 17, 0.5)';
      case 'jpg':
        return 'rgba(231, 136, 60, 0.6)';
      case 'png':
        return 'rgba(231, 136, 60, 0.6)';
      case 'rar':
        return 'rgba(116, 0, 109, 0.46)';
      case 'zip':
        return 'rgba(116, 0, 109, 0.46)';
      case 'txt':
        return 'rgba(136, 136, 136, 0.46)';
      default:
        '#ffffff';
    }
  }

}
