import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class UserService {

  private url = '/api-users';

  constructor(private http: HttpClient) { }

  newUser(name: string, pass: string, nickName: string, captchaToken: string) {
    console.log("POST new user " + name);

    let body = JSON.stringify([name, pass, nickName, captchaToken]);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({ headers });
    return this.http.post<User>(this.url + "/new", body, options);
  }

  changePassword(oldPassword: string, newPassword: string) {
    console.log("PUT existing user (change password)");

    let body = JSON.stringify([oldPassword, newPassword]);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({ headers });
    return this.http.put<Boolean>(this.url + "/changePassword", body, options);
  }

  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token });
      return ({ headers: headers });
    }
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }

  public existsUserByEmail(email: string){
    return this.http.get(this.url + `/isRegistered/${email}`);
  }

}
