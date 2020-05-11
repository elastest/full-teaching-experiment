import {Injectable} from '@angular/core';
import {Entry} from '../classes/entry';
import {Comment} from '../classes/comment';
import {AuthenticationService} from './authentication.service';


import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CourseDetails} from "../classes/course-details";

@Injectable()
export class ForumService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  private urlNewEntry = "/api-entries";
  private urlNewComment = "/api-comments";
  private urlEditForum = "/api-forum"

  //POST new Entry. Requires an Entry and the id of the CourseDetails that owns the Forum
  //On success returns the updated Forum that owns the posted entry
  public newEntry(entry: Entry, courseDetailsId: number) {
    console.log("POST new entry");

    let body = JSON.stringify(entry);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<{comment, entry}>(this.urlNewEntry + "/forum/" + courseDetailsId, body, options);
    //.catch(error => this.handleError("POST new entry FAIL. Response: ", error));
  }

  //POST new Comment. Requires a Comment, the id of the Entry that owns it and the id of the CourseDetails that owns the Forum
  //On success returns the update Entry that owns the posted comment
  public newComment(comment: Comment, entryId: number, courseDetailsId: number) {
    console.log("POST new comment");

    let body = JSON.stringify(comment);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<{comment, entry}>(this.urlNewComment + "/entry/" + entryId + "/forum/" + courseDetailsId, body, options);
  }

  //PUT existing Forum. Requires a boolean value for activating/deactivating the Forum and the id of the CourseDetails that owns it
  //On success returns the updated 'activated' attribute
  public editForum(activated: boolean, courseDetailsId: number) {
    console.log("PUT existing forum " + (activated ? "(activate)" : "(deactivate)"));

    let body = JSON.stringify(activated);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.put<boolean>(this.urlEditForum + "/edit/" + courseDetailsId, body, options);
    //.catch(error => this.handleError("PUT existing forum FAIL. Response: ", error));
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
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
    return this.http.post<Entry>(`${this.urlNewComment}/comment/${commentId}/${courseId}/${entryId}`, options);
  }
}
