import {Injectable} from '@angular/core';
import {Entry} from '../classes/entry';
import {Comment} from '../classes/comment';
import {AuthenticationService} from './authentication.service';


import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CourseDetails} from '../classes/course-details';
import * as uuid from 'uuid';


@Injectable()
export class ForumService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  private urlNewEntry = '/api-entries';
  private urlNewComment = '/api-comments';
  private urlFiles = '/api-load-files'

  //POST new Entry. Requires an Entry and the id of the CourseDetails that owns the Forum
  //On success returns the updated Forum that owns the posted entry
  public newEntry(entry: Entry, courseDetailsId: number) {
    console.log('POST new entry');

    let body = JSON.stringify(entry);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<{ comment, entry }>(this.urlNewEntry + '/forum/' + courseDetailsId, body, options);
    //.catch(error => this.handleError("POST new entry FAIL. Response: ", error));
  }

  public newAudioComment(parent: Comment, entryId: number, courseDetailsId: number, audio: Blob) {
    const id = uuid.v4();
    const file = new File([audio], `${id}.wav`);
    const formData = new FormData();
    formData.append('file', file, file.name);
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<Comment>(`${this.urlFiles}/upload/course/${courseDetailsId}/comment/${parent.id}/entry/${entryId}`, formData, options);
  }

  //POST new Comment. Requires a Comment, the id of the Entry that owns it and the id of the CourseDetails that owns the Forum
  //On success returns the update Entry that owns the posted comment
  public newComment(comment: Comment, entryId: number, courseDetailsId: number) {
    console.log('POST new comment');

    let body = JSON.stringify(comment);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<{ comment, entry }>(this.urlNewComment + '/entry/' + entryId + '/forum/' + courseDetailsId, body, options);
  }

  removeEntry(entry: Entry, cd: CourseDetails) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<boolean>(`${this.urlNewEntry}/remove/${entry.id}/${cd.id}`, null, options)
  }

  removeComment(commentId: number, courseId: number, entryId: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<Entry>(`${this.urlNewComment}/comment/delete/${commentId}/${courseId}/${entryId}`, options);
  }
}
