import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Course} from '../../classes/course';
import {MatTableDataSource} from '@angular/material/table';
import {AuthenticationService} from '../../services/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {AddAttendersModalComponent} from '../add-attenders-modal/add-attenders-modal.component';
import {EditionService} from '../../services/edition.service';
import {CourseService} from '../../services/course.service';
import {User} from '../../classes/user';
import {ModalService} from '../../services/modal.service';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-attenders-list',
  templateUrl: './attenders-list.component.html',
  styleUrls: ['./attenders-list.component.css']
})
export class AttendersListComponent implements OnInit, OnChanges {

  @Input('course')
  course: Course;

  constructor(public authenticationService: AuthenticationService,
              private courseService: CourseService,
              public matDialog: MatDialog,
              private announcerService: AnnouncerService,
              private editionService: EditionService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.announcerService.attenderAddedToCourseAnnouncer$.subscribe(data => {
      const course = data.course;
      const attenders = data.attenders;
      if(course.id === this.course.id){
        attenders.forEach(attender => {
          this.course.attenders.push(attender);
        })
        this.matDialog.closeAll();
        this.updateDataSource();
      }
    })
  }

  openAddModal() {
    this.matDialog.open(AddAttendersModalComponent, {});
    this.editionService.startAddingUsers(this.course);
  }

  displayedColumns: string[] = ['name', 'nickname', 'registrationdate', 'actions'];
  dataSource;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.course) {
      this.dataSource = new MatTableDataSource(this.course.attenders);
    }
  }

  updateDataSource() {
    this.dataSource = new MatTableDataSource(this.course.attenders);
  }

  deleteAttender(attender: User) {
    this.modalService.newCallbackedModal('Confirm attender removal', () => {
      this.courseService.deleteCourseAttenders(this.course, attender).subscribe(data => {
        this.course.attenders = data;
        this.updateDataSource();
        this.modalService.newSuccessModal('Attender successfully removed!', `The attender ${attender.name} was successfully removed from course!`, null);
      });
    });
  }
}
