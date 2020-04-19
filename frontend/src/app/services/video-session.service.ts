import {Injectable} from '@angular/core';

import {FTSession} from '../classes/FTSession';
import {Course} from '../classes/course';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class VideoSessionService {

  session: FTSession;
  course: Course;

  private urlSessions = '/api-video-sessions';

  constructor(private http: HttpClient) {
  }

  getSessionIdAndToken(mySessionId) {
    console.log('Getting OpenVidu sessionId and token for lesson \'' + mySessionId + '\'');
    return this.http.get<string>(this.urlSessions + '/get-sessionid-token/' + mySessionId);
  }

  removeUser(sessionName) {
    console.log('Removing user from session ' + sessionName);

    let jsonBody = JSON.stringify({
      'lessonId': sessionName
    });
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    let options = ({headers});
    return this.http.post(this.urlSessions + '/remove-user', jsonBody, options);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return Observable.throw('Server error (' + error.status + '): ' + error.text())
  }

}
