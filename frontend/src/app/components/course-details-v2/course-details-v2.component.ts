import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../classes/course';
import {CourseService} from '../../services/course.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AnnouncerService} from '../../services/announcer.service';
import {FileGroup} from '../../classes/file-group';
import {User} from '../../classes/user';
import {ModalService} from '../../services/modal.service';
import Swal from 'sweetalert2';
import {FileService} from '../../services/file.service';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-course-details-v2',
  templateUrl: './course-details-v2.component.html',
  styleUrls: ['./course-details-v2.component.css']
})
export class CourseDetailsV2Component implements OnInit, AfterViewInit {

  public course: Course;
  public isEditing = false;
  public user: User;
  public showedEntryId: number;

  @ViewChild('tabs') tabs: MatTabGroup;


  constructor(private builder: FormBuilder,
              private route: ActivatedRoute,
              private courseService: CourseService,
              private modalService: ModalService,
              public authService: AuthenticationService,
              private fileService: FileService,
              private announcerService: AnnouncerService) {
  }

  ngAfterViewInit(): void {
    this.changeTab();
  }

  // move to selected tab in route
  changeTab(): void{
    this.tabs.selectedIndex = Number.parseInt(this.route.snapshot.paramMap.get('tabId'));
  }

  initCourse(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log(`Initializing course: ${courseId}`);
    this.courseService.getCourse(Number(courseId)).subscribe(data => {
      this.course = data;
    });
  }

  ngOnInit() {
    this.authService.checkCredentials()
      .then(() => {

        this.user = this.authService.getCurrentUser();
        this.showedEntryId = Number.parseInt(this.route.snapshot.paramMap.get('showedEntryId'));

        // init course
        this.initCourse();

        // file group deleted announcer
        this.announcerService.fileGroupDeletedAnnouncer$.subscribe(fileGroupId => {
          if (this.recursiveFileGroupDeletion(this.course.courseDetails.files, fileGroupId)) {
            if (this.course.courseDetails.files.length == 0) {
              this.isEditing = false;
            } //If there are no fileGroups, mode edit is closed
          }
        });

        // file group updated announcer
        this.announcerService.fileInFileGroupUpdatedAnnouncer.subscribe(objs => {
          let fg = objs[0];
          let file = objs[1];
          if (fg) {
            console.log(`File group updated ${fg.id}`)
          }
        });

        // update course details on announce
        this.announcerService.fileGroupAddedAnnouncer.subscribe(courseDetails => {
          this.course.courseDetails = courseDetails;
        });

        // update files on announce
        this.announcerService.fileUploadedAnnouncer.subscribe(data => {
          let fg = data.fg;
          let course = data.course;
          if (this.course.id === course.id) {
            for (let parent of this.course.courseDetails.files) {
              let updated = this.updateFilesInFileGroup(parent, fg);
              if (updated) {
                break;
              }
            }
          }
        });

        // refresh course on announce
        this.announcerService.courseRefreshAnnouncer$.subscribe(course => {
          if(this.course.id === course.id){
            this.initCourse();
          }
        });


      })
      .catch(err => {
        console.log(err);
      })
  }

  updateFilesInFileGroup(parent: FileGroup, fileGroup: FileGroup) {
    if (parent.id === fileGroup.id) {
      parent.files = fileGroup.files;
      return true;
    } else {
      for (let child of parent.fileGroups) {
        let updated = this.updateFilesInFileGroup(child, fileGroup);
        if (updated) {
          console.log(child, fileGroup)
          return updated;
        }
      }
    }
  }


  //Deletes a fileGroup from this.course.courseDetails.files recursively, given a fileGroup id
  recursiveFileGroupDeletion(fileGroupLevel: FileGroup[], fileGroupDeletedId: number): boolean {
    if (fileGroupLevel) {
      for (let i = 0; i < fileGroupLevel.length; i++) {
        if (fileGroupLevel[i].id == fileGroupDeletedId) {
          fileGroupLevel.splice(i, 1);
          return true;
        }
        let deleted = this.recursiveFileGroupDeletion(fileGroupLevel[i].fileGroups, fileGroupDeletedId);
        if (deleted) {
          return deleted;
        }
      }
    }
  }


  //Deletes a fileGroup from this.course.courseDetails.files recursively, given a fileGroup id
  recursiveFileGroupAdd(fileGroupLevel: FileGroup[], newFileGroup: FileGroup): boolean {
    if (fileGroupLevel) {
      for (let i = 0; i < fileGroupLevel.length; i++) {
        if (fileGroupLevel[i].id == newFileGroup.fileGroupParent.id) {
          console.log(fileGroupLevel[i])
          fileGroupLevel[i].fileGroups.push(newFileGroup);
          return true;
        }
        let added = this.recursiveFileGroupAdd(fileGroupLevel[i].fileGroups, newFileGroup);
        if (added) {
          return added;
        }
      }
    }
  }

  toggleEditionMode() {
    this.isEditing = !this.isEditing;
  }

  editCourseTitle() {
    Swal.fire({
      title: 'Modify course title',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      },
    })
      .then(result => {
        if (result) {

          let value: string = result['value'] as any as string;

          if (value) {

            this.course.title = value;

            this.courseService.editCourse(this.course, value).subscribe(
              data => {

                this.modalService.newToastModal(`Successfully changed name of the course to: ${value}`)

              }, error => this.modalService.newErrorModal('An error ocured while updating the name of the course!', error, null)
            );

          }
        }
      })
  }

  createFileGroup() {
    this.modalService.newInputCallbackedModal('Enter file group name:', (resp) => {
      const name = resp.value;
      const fg = new FileGroup(name, null);
      this.fileService.newFileGroup(fg, this.course.courseDetails.id)
        .subscribe(data => {

          this.course.courseDetails.files = data.files;
          this.modalService.newToastModal('Added new file group!');
        })
    })
  }

}
