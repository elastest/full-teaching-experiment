import { Injectable } from '@angular/core';
import {Course} from "../classes/course";

@Injectable({
  providedIn: 'root'
})
export class EditionService {


  private courseAddingUsers: Course;

  constructor() { }


  startAddingUsers(course: Course){
    this.courseAddingUsers = course;
  }

  stopAddingUsers(){
    this.courseAddingUsers = null;
  }

  getCourseAddingUsers(){
    return this.courseAddingUsers;
  }


}
