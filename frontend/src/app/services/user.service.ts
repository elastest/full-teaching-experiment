import {Injectable} from '@angular/core';
import {User} from '../classes/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class UserService {

  private url = '/api-users';

  constructor(private http: HttpClient) {
  }

  getAll(page: number = 0, size: number = 10) {
    console.log(`Getting all users...`);

    const url = `${this.url}/all?page=${page}&size=${size}`;
    let headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({headers});
    return this.http.get(url, options);
  }

  getAllMatchingName(name: string, page: number = 0, size: number = 10){
    console.log(`Getting users matching name: ${name}`);
    const url = `${this.url}/byName/${name}?page=${page}&size=${size}`;
    let headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({headers});
    return this.http.get(url, options);
  }

  newUser(name: string, pass: string, nickName: string, captchaToken: string) {
    console.log('POST new user ' + name);

    let body = JSON.stringify([name, pass, nickName, captchaToken]);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({headers});
    return this.http.post<User>(this.url + '/new', body, options);
  }

  changePassword(oldPassword: string, newPassword: string) {
    console.log('PUT existing user (change password)');

    let body = JSON.stringify([oldPassword, newPassword]);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({headers});
    return this.http.put<Boolean>(this.url + '/changePassword', body, options);
  }

  changeNickName(user: User, value: string) {
    console.log('POST existing user (change nickname)');
    let headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = ({headers});
    return this.http.post<User>(this.url + `/changenickname/${user.id}/${value}`, null, options);
  }

}
