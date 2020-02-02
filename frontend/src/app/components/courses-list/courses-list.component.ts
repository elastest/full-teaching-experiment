import {Component, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {CourseService} from "../../services/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

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
              private route: ActivatedRoute
  ) {
    this.authenticationService.reqIsLogged();
  }

  ngOnInit() {
    this.courseService.getCourses(this.authenticationService.getCurrentUser())
      .subscribe((data) => {
        console.log(data)
        this.dataSource = data;
      })
  }


  showEditModal(course) {
    Swal.fire({
      title: 'Modify course',
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

          this.courseService.editCourse(course, value).subscribe(
            data => {
              console.log(data)
            }
          );

        }
      })
  }

}
