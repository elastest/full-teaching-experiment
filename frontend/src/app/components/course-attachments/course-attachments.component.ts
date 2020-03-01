import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../classes/course";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {File} from "../../classes/file";
import {FileGroup} from "../../classes/file-group";
import {FileType} from "../../enum/file-type.enum";
import {FileService} from "../../services/file.service";
import {ModalService} from "../../services/modal.service";
import {FilesEditionService} from "../../services/files-edition.service";

@Component({
  selector: 'app-course-attachments',
  templateUrl: './course-attachments.component.html',
  styleUrls: ['./course-attachments.component.css']
})
export class CourseAttachmentsComponent implements OnInit {

  @Input('file-groups')
  public fileGroups: FileGroup[];

  @Input('is-editing')
  isEditing: boolean;

  @Input('course')
  public course: Course;

  constructor(public authService: AuthenticationService, private fileService: FileService, private modalService: ModalService, private filesEditionService: FilesEditionService) {
  }

  ngOnInit(): void {
  }

  drop(files: File[], event: CdkDragDrop<{ title: string, poster: string }[]>) {
    moveItemInArray(files, event.previousIndex, event.currentIndex);
  }

  isFile(f: File) {
    return FileType.FILE === f.type;
  }

  isLink(f: File) {
    return FileType.LINK === f.type;
  }

  isVideo(f: File) {
    return FileType.VIDEO === f.type;
  }

  openLink(link: string) {
    console.log(`Redirecting to ${link}`)
    window.open(link, "_blank");
  }

  removeFromList(fg: FileGroup) {
  }

  deleteFileGroup(fileGroup: FileGroup) {

    let course = this.course;
    let fileService = this.fileService;
    let modalService = this.modalService;
    let filesEditionService = this.filesEditionService;

    this.modalService.newCallbackedModal('Are you sure about removing this file group?', function () {


      fileService.deleteFileGroup(fileGroup.id, course.id).subscribe(
        () => {
          //announce deletion so the parent component knows it
          filesEditionService.announceFileGroupDeleted(fileGroup.id);
          modalService.newToastModal('File group successfully deleted!')
        },
        error => {
          console.log(error);
          modalService.newErrorModal('Error removing file group!', error, null);
        }
      );

    });
  }

  editFileGroupName(fg: FileGroup) {

    let course = this.course;
    let fileService = this.fileService;
    let modalService = this.modalService;
    let filesEditionService = this.filesEditionService;

    this.modalService.newInputCallbackedModal('Change file group title: ', function (resp) {
      let newName = resp['value'];
      if (newName) {
        fg.title = newName;
        fileService.editFileGroup(fg, course.id).subscribe((data) => {
            filesEditionService.announceFileFilegroupUpdated([fg]);
            modalService.newToastModal(`File group title changed to: ${fg.title}`)
          },
          error => {
            modalService.newErrorModal('An error ocurred while updating the title of the file group!', error, null)
          });
      }
    })


  }
}
