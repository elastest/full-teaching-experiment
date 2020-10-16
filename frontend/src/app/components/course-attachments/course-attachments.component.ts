import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Course} from '../../classes/course';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {File} from '../../classes/file';
import {FileGroup} from '../../classes/file-group';
import {FileType} from '../../enum/file-type.enum';
import {FileService} from '../../services/file.service';
import {ModalService} from '../../services/modal.service';
import {AnnouncerService} from '../../services/announcer.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {FileUploaderComponent} from '../file-uploader/file-uploader.component';
import {VideoPlayerService} from '../../services/video-player.service';
import {Router} from '@angular/router';
import {PhotoViewerComponent} from '../photo-viewer/photo-viewer.component';


export interface DialogData {
  course: Course,
  fileGroup: FileGroup
}


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

  @ViewChild(SwalComponent)
  private swal: SwalComponent;

  @ViewChild('pickerInput')
  private pickerInput: ElementRef<HTMLInputElement>;

  constructor(private dialog: MatDialog,
              private videoPlayerService: VideoPlayerService,
              public authService: AuthenticationService,
              private fileService: FileService,
              private modalService: ModalService,
              private router: Router,
              private announcerService: AnnouncerService) {
  }

  ngOnInit(): void {
    this.announcerService.fileUploadedAnnouncer.subscribe(uploaded => {
      this.course = uploaded.course;
    })
  }


  drop(fgId: number, files: File[], event: CdkDragDrop<{ title: string, poster: string }[]>) {
    moveItemInArray(files, event.previousIndex, event.currentIndex);
    let newPos = event.currentIndex;
    let fileMoved = files[newPos];
    this.fileService.editFileOrder(fileMoved.id, fgId, fgId, newPos, this.course.id).subscribe(resp => {
      this.modalService.newToastModal(`File order changed successfully!`);
    }, error => {
      this.modalService.newErrorModal(`Error moving file!`, `An error ocured while moving this file!`, null);
    });
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
    window.open(link, '_blank');
  }

  deleteFileGroup(fileGroup: FileGroup) {
    this.modalService.newCallbackedModal('Are you sure about removing this file group?', () => {
      this.fileService.deleteFileGroup(fileGroup.id, this.course.id).subscribe(
        () => {
          //announce deletion so the parent component knows it
          this.announcerService.announceFileGroupDeleted(fileGroup.id);
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

    this.modalService.newInputCallbackedModal('Change file group title: ', (resp) => {
      let newName = resp['value'];
      if (newName) {
        fg.title = newName;
        this.fileService.editFileGroup(fg, this.course.id).subscribe((data) => {
            this.announcerService.announceFileFilegroupUpdated([fg]);
            this.modalService.newToastModal(`File group title changed to: ${fg.title}`)
          },
          error => {
            this.modalService.newErrorModal('An error ocurred while updating the title of the file group!', error, null)
          });
      }
    })
  }


  newFileGroup(fgParent: FileGroup) {
    this.modalService.newInputCallbackedModal('New file group name:', (resp) => {
      let name = resp.value;
      if(name.length <= 0){
        this.modalService.newErrorModal('Invalid file group name', 'You must include a valid file group name', null);
      }
      else if (name) {
        let newFileGroup = new FileGroup(name, fgParent);
        this.fileService.newFileGroup(newFileGroup, this.course.courseDetails.id).subscribe(courseDetails => {
          this.announcerService.announceNewFileGroup(courseDetails);
        }, error => this.modalService.newErrorModal('Error creating a new file group!', error, null))
      }
    });
  }


  getBgColorClass() {
    return `bg-recursive-${this.recursiveIndex}`;
  }

  newAttachment(fg: FileGroup) {
    this.dialog.open(FileUploaderComponent, {
      data: {
        course: this.course,
        fileGroup: fg
      },
      width: '60vh'
    })
    this.announcerService.announcePrepareFileUpload(this.course, fg);
  }

  deleteAttachment(f: File, fileGroup: FileGroup) {
    this.modalService.newCallbackedModal(`Confirm attachment removal`, () => {
      this.fileService.deleteFile(f.id, fileGroup.id, this.course.id).subscribe(data => {
          fileGroup.files = fileGroup.files.filter(file => f.id !== file.id);
          this.modalService.newToastModal(`Attachment removed successfully!`);
        },
        error => {
          this.modalService.newErrorModal(`Error deleting file attachment!`, `Error: ${error}`, null);
        });
    });
  }

  downloadAttachment(f: File) {
    this.fileService.downloadFile(this.course.id, f);
  }

  playVideo(f: File) {
    this.videoPlayerService.startPlayingVideo(f, this.course);
  }

  openPDF(f: File) {
    const url = `/pdf/view/${this.course.id}/${f.id}`;
    this.router.navigate([url]);
  }

  isPDF(f: File) {
    return f.name.endsWith('.pdf');
  }

  isPicture(f: File) {
    return f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.jpeg');
  }

  openPhoto(f: File) {
    this.dialog.open(PhotoViewerComponent, {
      data: {
        course: this.course,
        file: f
      }
    })
  }

  hideFile(file: File, fg: FileGroup, event: any): void {
    file.hiddenUntil = event.value;
    this.fileService.editFileGroup(fg, this.course.id)
      .subscribe(data => {
        this.modalService.newToastModal(`File hidden until: ${file.hiddenUntil}`)
      }, error => {
        console.log(error);
        this.modalService.newErrorModal(`Error hidding file!`, `Contact your administrator`, null);
      })
  }

  showFile(file: File, fg: FileGroup): void {
    file.hiddenUntil = null;
    this.pickerInput.nativeElement.value = null;
    this.fileService.editFileGroup(fg, this.course.id)
      .subscribe(data => {
        this.modalService.newToastModal(`File date restriction removed!`)
      }, error => {
        console.log(error);
        this.modalService.newErrorModal(`Error hidding file!`, `Contact your administrator`, null);
      })
  }
}
