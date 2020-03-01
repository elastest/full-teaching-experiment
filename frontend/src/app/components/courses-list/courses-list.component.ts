import {Component, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {CourseService} from "../../services/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";

const Swal = require('sweetalert2');

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  dataSource: Array<Course>;
  displayedColumns: string[] = ['title', 'details'];


  constructor(private courseService: CourseService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService
  ) {
    this.authenticationService.reqIsLogged();
  }

  ngOnInit() {
    this.courseService.getCourses(this.authenticationService.getCurrentUser())
      .subscribe((data) => {
        this.dataSource = data;
      })
  }


  showEditModal(course: Course) {
    Swal.fire({
      title: 'Modify course name',
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

          let value = result['value'];

          course.title = value;

          this.courseService.editCourse(course, value).subscribe(
            data => {

              this.modalService.newToastModal(`Successfully changed name of the course to: ${value}`)

            }, error => this.modalService.newErrorModal('An error ocured while updating the name of the course!', error, null)
          );

        }
      })
  }

}
