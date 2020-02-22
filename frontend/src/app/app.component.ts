import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
declare var VANTA;

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit{

  constructor(private router: Router){}
  isVideoSessionUrl(){

    return (this.router.url.substring(0, '/session/'.length) === '/session/');
  }

  ngOnInit(): void {
    VANTA.NET({
      el: "#sticky-footer-div",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0xc191b,
      points: 11.00,
      maxDistance: 15.00,
      spacing: 17.00
    })
  }

}
