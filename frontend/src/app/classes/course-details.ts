import {Course} from './course';
import {Forum} from './forum';
import {FileGroup} from './file-group';

export class CourseDetails {

  public id?: number;
  public info: string;
  public forum: Forum;
  public files: FileGroup[];
  public course: Course;

  constructor(forum: Forum, files: FileGroup[]) {
    this.info = '';
    this.forum = forum;
    this.files = files;
  }

}
