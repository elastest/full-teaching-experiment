import {Component, Input, OnInit} from '@angular/core';

import {Comment} from '../../classes/comment';
import {Entry} from '../../classes/entry';
import {FileGroup} from '../../classes/file-group';

import {CourseDetailsModalDataService} from '../../services/course-details-modal-data.service';
import {AnimationService} from '../../services/animation.service';
import {ModalService} from "../../services/modal.service";
import {Course} from "../../classes/course";
import {ForumService} from "../../services/forum.service";
import {CourseDetails} from "../../classes/course-details";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  @Input()
  public courseDetailsId: number;

  @Input()
  public entryId: number;


  constructor(public courseDetailsModalDataService: CourseDetailsModalDataService, public animationService: AnimationService, private modalService: ModalService, private forumService: ForumService) {
  }

  ngOnInit() {
  }

  updatePostModalMode(mode: number, title: string, header: Entry, commentReplay: Comment, fileGroup: FileGroup) {
    let objs = [mode, title, header, commentReplay, fileGroup];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }

  isCommentTeacher(comment: Comment) {
    return (comment.user.roles.indexOf('ROLE_TEACHER') > -1);
  }

  onHovering(event) {
    $(event.target).attr("controls", "");
  }

  onUnhovering(event) {
    $(event.target).removeAttr("controls");
  }

  showReplyModal() {
    let service = this.forumService;
    let entry = this.entryId;
    let details = this.courseDetailsId;
    let comment = this.comment;
    let modalService = this.modalService;

    this.modalService.newCallbackedModal('New entry: ',function (resp) {
      if (resp) {
        let value = resp['value'];
        if (value) {
          service.newComment(new Comment(value, '', false, comment), entry, details).subscribe(
            data => {
              comment.replies.push(data.comment);
              modalService.newToastModal('Comment added successfully!');
            },
            error => {
              console.log(error);
              modalService.newErrorModal("Ooops... something went wrong", "There was an unexpected error while trying to write your comment!", null);
            }
          );
        }
      }

    })
  }
}
