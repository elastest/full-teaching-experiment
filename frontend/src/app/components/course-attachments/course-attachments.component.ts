import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../classes/course";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {File} from "../../classes/file";
import {FileGroup} from "../../classes/file-group";
import {FileType} from "../../enum/file-type.enum";

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

  constructor(public authService: AuthenticationService) { }

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
}
