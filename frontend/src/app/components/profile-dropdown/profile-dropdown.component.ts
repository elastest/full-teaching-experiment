import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }


  getPicture() {
    return environment.API_URL + this.authenticationService.getCurrentUser().picture;
  }
}
