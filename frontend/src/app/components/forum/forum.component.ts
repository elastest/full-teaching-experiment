import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Course} from '../../classes/course';
import {Entry} from '../../classes/entry';
import {Comment} from '../../classes/comment';
import {AnimationService} from '../../services/animation.service';
import {CourseDetailsModalDataService} from '../../services/course-details-modal-data.service';
import {AuthenticationService} from '../../services/authentication.service';
import {ForumService} from '../../services/forum.service';
import {ModalService} from '../../services/modal.service';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, OnChanges {

  @Input('course')
  course: Course;

  @Input('showedEntry')
  showedEntry: number;

  private openedConversations = [];

  constructor(public animationService: AnimationService,
              private forumService: ForumService,
              private courseDetailsModalDataService: CourseDetailsModalDataService,
              public authenticationService: AuthenticationService,
              private announcerService: AnnouncerService,
              private modalService: ModalService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.showedEntry){
      this.openedConversations.push(this.showedEntry);
    }
  }

  ngOnInit() {
    this.announcerService.commentRemovedAnnouncer$.subscribe(data => {
      // replace old comments with new comments, removing the deleted comment
      console.log(data)
      this.course.courseDetails.forum.entries.find(e => e.id === data.entry.id).comments = data.entry.comments;
    });
  }

  openConversation(entry: Entry): void {
    this.openedConversations.push(entry.id);
  }

  closeConversation(entry: Entry): void {
    this.openedConversations = this.openedConversations.filter(c => c === entry.id);
  }

  isOpenedConversation(entry: Entry): boolean {
    return this.openedConversations.includes(entry.id);
  }

  showNewEntryModal() {
    let course = this.course;
    let service = this.forumService;
    let modalService = this.modalService;
    this.modalService.newMultiStageModalWithCallback(['Entry title:', 'Firs comment:'], ['1', '2'], function (resp) {
      if (resp) {
        let value = resp.value;
        if (value) {
          let entry = new Entry(value[0], [new Comment(value[1], '', null)]);
          console.log(entry)
          service.newEntry(entry, course.courseDetails.id).subscribe(data => {
              let entry = data.entry;
              course.courseDetails.forum.entries.push(entry);
              modalService.newToastModal('Successfully created entry!');
            },
            error => {
              modalService.newErrorModal('Ooops... there was an unexpected error!', 'There was an error creating your new entry!', null);
            });
        }
      }

    })
  }

  removeEntry(entry: Entry) {
    this.modalService.newCallbackedModal('Confirm the entry removal', () => {
      console.log('Removing entry');
      this.forumService.removeEntry(entry, this.course.courseDetails).subscribe(data => {
        this.course.courseDetails.forum.entries = this.course.courseDetails.forum.entries.filter(e => e.id !== entry.id);
        this.modalService.newToastModal(`Entry "${entry.title}" removed successfully!`)
      }, error => {
        this.modalService.newErrorModal('Error removing entry!', error, null);
      });
    });
  }

  newComment(entry: Entry) {
    this.modalService.newInputCallbackedModal('New comment', (resp) => {
      const value = resp.value;
      if (value) {
        const comment = new Comment(value, '', null);
        this.forumService.newComment(comment, entry.id, this.course.courseDetails.id).subscribe(resp => {
          entry.comments.push(resp.comment);
          this.modalService.newSuccessModal(`Successfully added comment!`, `New comment added!`, null);
        }, error => {
          console.log(error);
          this.modalService.newErrorModal(`Error creating new comment!`, `Error: ${JSON.stringify(error)}`, null);
        });
      }
    })
  }
}
