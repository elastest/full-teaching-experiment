import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Course} from "../../classes/course";
import {MatTableDataSource} from "@angular/material/table";
import {AuthenticationService} from "../../services/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordComponent} from "../change-password/change-password.component";
import {AddAttendersModalComponent} from "../add-attenders-modal/add-attenders-modal.component";
import {EditionService} from "../../services/edition.service";
import {CourseService} from "../../services/course.service";
import {User} from "../../classes/user";
import {ModalService} from "../../services/modal.service";

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
              private editionService: EditionService,
              private modalService: ModalService) { }

  ngOnInit(): void {
  }

  openAddModal(){

    this.matDialog.open(AddAttendersModalComponent,{
      width: '75vh',
      height: '55vh'
    });

    this.editionService.startAddingUsers(this.course);
  }

  displayedColumns: string[] = ['name', 'nickname', 'registrationdate', 'actions'];
  dataSource;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.course){
      this.dataSource = new MatTableDataSource(this.course.attenders);
    }
  }

  deleteAttender(attender: User) {
    this.modalService.newCallbackedModal('Confirm attender removal', () => {
      this.course.attenders = this.course.attenders.filter(a => a.id !== attender.id);
      this.courseService.deleteCourseAttenders(this.course);
    });
  }
}
