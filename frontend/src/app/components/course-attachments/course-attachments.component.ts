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

  @Input('recursive-index')
  public recursiveIndex: number;

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



    this.modalService.newCallbackedModal('Are you sure about removing this file group?',  () => {


      this.fileService.deleteFileGroup(fileGroup.id, this.course.id).subscribe(
        () => {
          //announce deletion so the parent component knows it
          this.filesEditionService.announceFileGroupDeleted(fileGroup.id);
          this.modalService.newToastModal('File group successfully deleted!')
        },
        error => {
          console.log(error);
          this.modalService.newErrorModal('Error removing file group!', error, null);
        }
      );

    });
  }

  editFileGroupName(fg: FileGroup) {

    this.modalService.newInputCallbackedModal('Change file group title: ',  (resp) => {
      let newName = resp['value'];
      if (newName) {
        fg.title = newName;
        this.fileService.editFileGroup(fg, this.course.id).subscribe((data) => {
            this.filesEditionService.announceFileFilegroupUpdated([fg]);
            this.modalService.newToastModal(`File group title changed to: ${fg.title}`)
          },
          error => {
            this.modalService.newErrorModal('An error ocurred while updating the title of the file group!', error, null)
          });
      }
    })
  }



  newFileGroup(fgParent: FileGroup){

    this.modalService.newInputCallbackedModal('New file group name:', (resp) => {

      let name = resp.value;

      if(name) {
        let newFileGroup = new FileGroup(name, fgParent);

        this.fileService.newFileGroup(newFileGroup, this.course.courseDetails.id).subscribe(resp => {
          this.filesEditionService.announceNewFileGroup(newFileGroup);
        }, error => this.modalService.newErrorModal('Error creating a new file group!', error, null))
      }

    })


  }


  getBgColorClass(){
    return `bg-recursive-${this.recursiveIndex}`;
  }

}
