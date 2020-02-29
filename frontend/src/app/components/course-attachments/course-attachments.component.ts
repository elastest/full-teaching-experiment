import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../classes/course";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {File} from "../../classes/file";
import {FileGroup} from "../../classes/file-group";
import {FileType} from "../../enum/file-type.enum";
import {FileService} from "../../services/file.service";
import {ModalService} from "../../services/modal.service";

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

  constructor(public authService: AuthenticationService, private fileService: FileService, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  drop(files: File[], event: CdkDragDrop<{title: string, poster: string}[]>) {
    moveItemInArray(files, event.previousIndex, event.currentIndex);
  }

  isFile(f: File){
    return FileType.FILE === f.type;
  }

  isLink(f: File){
    return FileType.LINK === f.type;
  }

  isVideo(f: File){
    return FileType.VIDEO === f.type;
  }

  openLink(link: string) {
    console.log(`Redirecting to ${link}`)
    window.open(link, "_blank");
  }

  removeFromList(fg: FileGroup){
    this.fileGroups = this.fileGroups.filter(fGroup => fGroup.id !== fg.id);
  }

  deleteFileGroup(fileGroup: FileGroup) {

    let course = this.course;
    let fileService = this.fileService;
    let fileGroups = this.fileGroups;
    let modalService = this.modalService;
    let removeFunction = this.removeFromList;

    this.modalService.newCallbackedModal('Are you sure about removing this file group?', function (resp) {
      fileService.deleteFileGroup(fileGroup.id, course.id).subscribe(
        response => {
          removeFunction(fileGroup);
        },
        error => {
          console.log(error);
          modalService.newErrorModal('Error removing file group!', error, null);
        }
      );
    });
  }
}
