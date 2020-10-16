import { Injectable } from '@angular/core';
import { FTSession } from '../classes/FTSession';
import { Course } from '../classes/course';
import { AuthenticationService } from './authentication.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class SessionService {

  private urlSessions = '/api-sessions';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  //POST new session. On success returns the updated Course that owns the posted session
  public newSession(session: FTSession, courseId: number) {
    console.log("POST new session");

    let body = JSON.stringify(session);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = ({ headers });
    return this.http.post<Course>(this.urlSessions + "/course/" + courseId, body, options);
    //.catch(error => this.handleError("POST new session FAIL. Response: ", error));
  }

  //PUT existing session. On success returns the updated session
  public editSession(session: FTSession) {
    console.log("PUT existing session");

    let body = JSON.stringify(session);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = ({ headers });
    return this.http.put<FTSession>(this.urlSessions + "/edit", body, options);
  }

  //DELETE existing session. On success returns the deleted session
  public deleteSession(sessionId: number) {
    console.log("DELETE session");

    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = ({ headers });
    return this.http.delete<FTSession>(this.urlSessions + "/delete/" + sessionId, options);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}
