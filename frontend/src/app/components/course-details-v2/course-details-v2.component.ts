import { Component, OnInit } from '@angular/core';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Course} from "../../classes/course";
import {CourseService} from "../../services/course.service";
import {AuthenticationService} from "../../services/authentication.service";
import {FilesEditionService} from "../../services/files-edition.service";
import {FileGroup} from "../../classes/file-group";

@Component({
  selector: 'app-course-details-v2',
  templateUrl: './course-details-v2.component.html',
  styleUrls: ['./course-details-v2.component.css']
})
export class CourseDetailsV2Component implements OnInit {

  public course: Course;
  public isEditing = false;

  constructor(private builder: FormBuilder,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public authService: AuthenticationService,
              private filesEditionService: FilesEditionService) {

    let courseId = this.route.snapshot.paramMap.get('id');
    this.courseService.getCourse(Number(courseId)).subscribe(data => {
      this.course = data;
    });

    filesEditionService.fileGroupDeletedAnnounced$.subscribe(fileGroupId => {
      if (this.recursiveFileGroupDeletion(this.course.courseDetails.files, fileGroupId)) {
        if (this.course.courseDetails.files.length == 0) this.isEditing = false; //If there are no fileGroups, mode edit is closed
      }
    });


    filesEditionService.fileFilegroupUpdatedAnnounced$.subscribe(objs => {

      let fg = objs[0];
      let file = objs[1];

      if(fg){
        console.log(`File group updated ${fg.id}`)
      }


    })

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
        if (deleted) return deleted;
      }
    }
  }



  ngOnInit() {

  }

  toggleEditionMode() {
    this.isEditing = !this.isEditing;
  }
}
