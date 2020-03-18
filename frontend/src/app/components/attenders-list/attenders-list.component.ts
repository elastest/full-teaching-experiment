import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Course} from "../../classes/course";
import {MatTableDataSource} from "@angular/material/table";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-attenders-list',
  templateUrl: './attenders-list.component.html',
  styleUrls: ['./attenders-list.component.css']
})
export class AttendersListComponent implements OnInit, OnChanges {

  @Input('course')
  course: Course;


  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
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
}
