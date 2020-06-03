import {Component, OnInit} from '@angular/core';
import {Course} from '../../classes/course';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {ModalService} from '../../services/modal.service';
import {CourseDetails} from '../../classes/course-details';
import {Forum} from '../../classes/forum';

const Swal = require('sweetalert2');

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  dataSource: Array<Course>;

  constructor(private courseService: CourseService,
              public authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService
  ) {
  }

  ngOnInit() {
    this.authenticationService.reqIsLogged().then(() => {
      this.courseService.getCourses(this.authenticationService.getCurrentUser())
        .subscribe((data) => {
          this.dataSource = data;
        })
    })
      .catch((err) => {
        console.log(err);
      })
  }

  createCourse() {

    this.modalService.newInputCallbackedModal('Enter course title', (courseName) => {
      const name = courseName.value;
      const course = new Course(name, '', new CourseDetails(new Forum(true), []));
      this.courseService.newCourse(course).subscribe(resp => {
        this.dataSource.push(resp);
      }, error => {
        console.log(error);
      });
    })

  }


  deleteCourse(course: Course) {
    this.modalService.newCallbackedModal(`Are you sure about removing this course?`, () => {
      this.courseService.deleteCourse(course.id).subscribe(resp => {
        this.modalService.newToastModal(`Course ${course.title} successfully removed!`);
        this.dataSource = this.dataSource.filter(c => c.id !== course.id);
      }, error => {
        this.modalService.newErrorModal(`Error removing course ${course.title}`, JSON.stringify(error), null);
      })
    })
  }
}
