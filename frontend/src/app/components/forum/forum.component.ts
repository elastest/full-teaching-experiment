import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {Entry} from "../../classes/entry";
import {Comment} from "../../classes/comment";
import {AnimationService} from "../../services/animation.service";
import {CourseDetailsModalDataService} from "../../services/course-details-modal-data.service";
import {FileGroup} from "../../classes/file-group";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  @Input('course')
  course: Course;
  fadeAnim: string = 'commentsHidden';
  selectedEntry: Entry;
  postModalCommentReplay: Comment;

  constructor(public animationService: AnimationService,
              private courseDetailsModalDataService: CourseDetailsModalDataService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  isEntryTeacher(entry: Entry) {
    return (entry.user.roles.indexOf('ROLE_TEACHER') > -1);
  }

  getLastEntryComment(entry: Entry) {
    let comment = entry.comments[0];
    for (let c of entry.comments) {
      if (c.date > comment.date) comment = c;
      comment = this.recursiveReplyDateCheck(comment);
    }
    return comment;
  }

  private recursiveReplyDateCheck(c: Comment) {
    for (let r of c.replies) {
      if (r.date > c.date) c = r;
      c = this.recursiveReplyDateCheck(r);
    }
    return c;
  }

  updatePostModalMode(mode: number, title: string, header: Entry, commentReplay: Comment, fileGroup: FileGroup) {
    // mode[0: "New Entry", 1: "New comment", 2: "New session", 3: "New VideoEntry", 4: "New FileGroup", 5: "Add files"]
    let objs = [mode, title, header, commentReplay, fileGroup];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }

  updatePutDeleteModalMode(mode: number, title: string) {
    let objs = [mode, title];
    this.courseDetailsModalDataService.announcePutdeleteMode(objs);
  }
}
