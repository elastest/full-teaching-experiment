import {Injectable} from '@angular/core';

import * as FileSaver from 'file-saver';

import {FileGroup} from '../classes/file-group';
import {File} from '../classes/file';
import {CourseDetails} from '../classes/course-details';
import {AuthenticationService} from './authentication.service';

import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VideoPlayerService} from './video-player.service';
import {Subject} from 'rxjs';
import {User} from '../classes/user';

@Injectable()
export class FileService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService, private videoPlayerService: VideoPlayerService) {
  }

  private url = '/api-files';
  private pendingDownload: boolean = false;

  //POST new FileGroup. Requires the FileGroup and the courseDetails id that owns it
  //On success returns the entire updated CourseDetails
  public newFileGroup(fileGroup: FileGroup, courseDetailsId: number) {
    console.log('POST new filegroup');

    let body = JSON.stringify(fileGroup);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<CourseDetails>(this.url + '/' + courseDetailsId, body, options);
  }

  //DELETE existing FileGroup. Requires the fileGroup id and its course's id
  //On succes returns the deleted FileGroup
  public deleteFileGroup(fileGroupId: number, courseId: number) {
    console.log('DELETE filegroup ' + fileGroupId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.delete<FileGroup>(this.url + '/delete/file-group/' + fileGroupId + '/course/' + courseId, options);
  }

  //DELETE existing File. Requires the file id, the fileGroup id that owns it and their course's id
  //On succes returns the deleted File
  public deleteFile(fileId: number, fileGroupId: number, courseId: number) {
    console.log('DELETE file ' + fileId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.delete<File>(this.url + '/delete/file/' + fileId + '/file-group/' + fileGroupId + '/course/' + courseId, options);
  }

  //PUT existing FileGroup. Requires the modified FileGroup and the course id
  //On success returns the updated root FileGroup
  public editFileGroup(fileGroup: FileGroup, courseId: number) {
    console.log('PUT existing filegroup ' + fileGroup.id);
    let body = JSON.stringify(fileGroup);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.put<FileGroup>(this.url + '/edit/file-group/course/' + courseId, body, options);
    //.catch(error => this.handleError("PUT existing filegroup FAIL. Response: ", error));
  }

  //PUT 2 FileGroups. Requires the id of the file moved, the ids of the source and the target FileGroups, the id of the Course and the position of the file in the target FileGroup
  //On success returns the all the fileGroups of the course
  public editFileOrder(fileMovedId: number, fileGroupSourceId: number, fileGroupTargetId: number, filePosition: number, courseId: number) {
    console.log('PUT existing filegroups (editing file order). From ' + fileGroupSourceId + ' to ' + fileGroupTargetId + ' into position ' + fileGroupTargetId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.put<FileGroup[]>(this.url + '/edit/file-order/course/' + courseId + '/file/' + fileMovedId + '/from/' + fileGroupSourceId + '/to/' + fileGroupTargetId + '/pos/' + filePosition, options)
  }

  downloadFileAsBlob(courseId: number, file: File, callback){
    // Xhr creates new context so we need to create reference to this
    let self = this;

    // Status flag used in the template.
    this.pendingDownload = true;

    // Create the Xhr request object
    let xhr = new XMLHttpRequest();
    let url = `${environment.API_URL}/api-load-files/course/${courseId}/download/${file.id}`;

    xhr.withCredentials = true;

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    // Xhr callback when we get a result back
    // We are not using arrow function because we need the 'this' context
    xhr.onreadystatechange = function () {

      // We use setTimeout to trigger change detection in Zones
      setTimeout(() => {
        self.pendingDownload = false;
      }, 0);

      // If we get an HTTP status OK (200), save the file using fileSaver
      if (xhr.readyState === 4 && xhr.status === 200) {
        const blob = new Blob([this.response], {type: this.response.type});
        callback(blob);
      }
    };

    // Start the Ajax request
    xhr.send();
  }

  public downloadFile(courseId: number, file: File) {
    this.downloadFileAsBlob(courseId, file,(blob) => {
      FileSaver.saveAs(blob, file.name);
    })
  }

  public uploadWebLink(courseId: number, fileGroupId: number, file: File){
    console.log('Adding web link!');
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<FileGroup>(`/api-files/web-link/${courseId}/${fileGroupId}`, file, options);
  }

  public uploadFile(courseId: number, fileGroupId: number, formData: FormData, type: number) {
    console.log(`Uploading a file for course ${courseId} and file group ${fileGroupId}`);
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    return this.http.post<FileGroup>(`/api-load-files/upload/course/${courseId}/file-group/${fileGroupId}/type/${type}`, formData, options);
  }

  public changeProfilePicture(user: User, file: any){
    const url = `/api-load-files/upload/picture/${user.id}`
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authenticationService.token
    });
    let options = ({headers});
    const formData: FormData = new FormData();
    formData.set('file', file, file.name);
    return this.http.post<User>(url, formData, options);
  }
}
