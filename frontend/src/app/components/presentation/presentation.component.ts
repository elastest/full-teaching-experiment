import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})

export class PresentationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    //If the user is loggedIn, navigates to dashboard
    this.authenticationService.checkLoggedIn()
      .then(() => {
        this.router.navigate(['/courses']);
      })
      .catch((e) => {
        console.log(e)
      });
  }

}
