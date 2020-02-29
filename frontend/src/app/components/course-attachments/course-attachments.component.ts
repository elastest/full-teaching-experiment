import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../classes/course";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {File} from "../../classes/file";
import {FileGroup} from "../../classes/file-group";

@Component({
  selector: 'app-course-attachments',
  templateUrl: './course-attachments.component.html',
  styleUrls: ['./course-attachments.component.css']
})
export class CourseAttachmentsComponent implements OnInit {

  @Input('file-groups')
  public fileGroups: FileGroup[];


  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  drop(files: File[], event: CdkDragDrop<{title: string, poster: string}[]>) {
    moveItemInArray(files, event.previousIndex, event.currentIndex);
  }
}
