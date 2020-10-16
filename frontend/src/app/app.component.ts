import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit{

  constructor(private router: Router,
              public authenticationService: AuthenticationService){}

  isVideoSessionUrl(){
    return (this.router.url.substring(0, '/session/'.length) === '/session/') && !this.router.url.includes('details');
  }

  ngOnInit(): void {
  }

}
