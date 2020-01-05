import {Injectable} from '@angular/core';

import {Course} from '../classes/course';
import {User} from '../classes/user';
import {AuthenticationService} from './authentication.service';

import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class CourseService {

  private url = '/api-courses';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  getCourses(user: User) {
    console.log("GET courses for user " + user.nickName);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {
      headers
    };
    return this.http.get<Course[]>(this.url + "/user/" + user.id, options);
  }

  getCourse(courseId: number) {
    console.log("GET course " + courseId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {headers};
    return this.http.get<Course>(this.url + "/course/" + courseId, options);
  }

  //POST new course. On success returns the created course
  newCourse(course: Course) {
    console.log("POST new course");

    let body = JSON.stringify(course);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = {headers};
    return this.http.post<Course>(this.url + "/new", body, options);
  }

  //PUT existing course. On success returns the updated course
  public editCourse(course: Course, context: string) {
    console.log("PUT existing course " + course.id + " (" + context + ")");

    let body = JSON.stringify(course);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {headers};
    return this.http.put<Course>(this.url + "/edit", body, options);
    //.catch(error => this.handleError("PUT existing course FAIL (" + context + "). Response: ", error));
  }

  //DELETE existing course. On success returns the deleted course (simplified version)
  public deleteCourse(courseId: number) {
    console.log("DELETE course " + courseId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {headers};
    return this.http.delete<Course>(this.url + "/delete/" + courseId, options);
  }

  //PUT existing course, modifying its attenders (adding them). On success returns the updated course.attenders array
  public addCourseAttenders(courseId: number, userEmails: string[]) {
    console.log("PUT exsiting course (add attenders)");

    let body = JSON.stringify(userEmails);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {headers};
    return this.http.put<{attendersAdded}>(this.url + "/edit/add-attenders/course/" + courseId, body, options);
    //.catch(error => this.handleError("PUT existing course FAIL (add attenders). Response: ", error));
  }

  //PUT existing course, modifying its attenders (deleting them). On success returns the updated course.attenders array
  public deleteCourseAttenders(course: Course) {
    console.log("PUT exsiting course (remove attender)");

    let body = JSON.stringify(course);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = {headers};
    return this.http.put<User[]>(this.url + "/edit/delete-attenders", body, options);
    // .subscribe((response : Response) => {
    //   console.log("PUT existing course SUCCESS (remove attender). Response: ", (response.json() as unknown as User[]));
    //   return (response.json() as unknown as User[]);
    // });
    // //.catch(error => this.handleError("PUT existing course FAIL (remove attender). Response: ", error));
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}
