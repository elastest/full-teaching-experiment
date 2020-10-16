import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

import {User} from '../classes/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalService} from './modal.service';
import {CookieService} from 'ngx-cookie-service';
import {WebsocketService} from './websocket.service';


@Injectable()
export class AuthenticationService {

  private urlLogIn = '/api-logIn';
  private urlLogOut = '/api-logOut';
  private TEACHER = 'ROLE_TEACHER';
  private STUDENT = 'ROLE_STUDENT';
  private ADMIN = 'ROLE_ADMIN';
  private readonly USER_COOKIE_NAME = 'USER_COOKIE';
  public token: string;
  private user: User;
  private role: string;

  constructor(private http: HttpClient,
              private websocketService: WebsocketService,
              private router: Router,
              private modalService: ModalService,
              private cookieService: CookieService) {
    const userCookie = cookieService.get(this.USER_COOKIE_NAME);
    this.user = userCookie ? JSON.parse(cookieService.get(this.USER_COOKIE_NAME)) : null;
  }

  logIn(user: string, pass: string) {
    console.log(`New login!`);
    let userPass = user + ':' + pass;
    let head = new HttpHeaders({
      Authorization: 'Basic ' + btoa(userPass),
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.get(this.urlLogIn, {
      headers: head,
    })
      .map(resp => {
        this.processLogInResponse(resp);
        return this.user;
      })
      .catch(error => Observable.throw(error));
  }

  logOut() {
    console.log(`New logout!`);
    return this.http.get(this.urlLogOut).subscribe(
      response => {

        console.log('Logout succesful!');

        this.user = null;
        this.role = null;

        // clear token remove user from local storage to log user out and navigates to welcome page
        this.token = null;
        localStorage.removeItem('login');
        localStorage.removeItem('rol');
        this.router.navigate(['']);
        this.modalService.newLogoutModal();
        return response;
      },
      error => Observable.throw(error)
    )

  }

  private processLogInResponse(response) {
    this.user = (response as User);
    localStorage.setItem('login', 'FULLTEACHING');
    if (this.user.roles.indexOf('ROLE_ADMIN') !== -1) {
      this.role = 'ROLE_ADMIN';
      localStorage.setItem('rol', 'ROLE_ADMIN');
    }
    if (this.user.roles.indexOf('ROLE_TEACHER') !== -1) {
      this.role = 'ROLE_TEACHER';
      localStorage.setItem('rol', 'ROLE_TEACHER');
    }
    if (this.user.roles.indexOf('ROLE_STUDENT') !== -1) {
      this.role = 'ROLE_STUDENT';
      localStorage.setItem('rol', 'ROLE_STUDENT');
    }
    this.websocketService._connect();
  }


  private reqIsLogged(): Promise<any> {
    console.log(`Checking if user is logged in!`);
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest'
      });
      let options = {headers};

      this.http.get(this.urlLogIn, options).subscribe(
        response => {
          this.processLogInResponse(response);
          resolve();
        },
        error => {
          let msg = '';
          if (error.status !== 401) {
            msg = 'Error when asking if logged: ' + JSON.stringify(error);
            console.error(msg);
          } else {
            msg = 'User is not logged in';
          }
          reject(msg);
        }
      );
    });
  }

  checkLoggedIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isLoggedIn()) {
        this.reqIsLogged()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    });
  }

  isLoggedIn() {
    return (!!this.user);
  }

  getCurrentUser() {
    return this.user;
  }

  isTeacher() {
    return this.user ? (this.user.roles.includes(this.TEACHER) || this.role === this.TEACHER) : false;
  }
}
