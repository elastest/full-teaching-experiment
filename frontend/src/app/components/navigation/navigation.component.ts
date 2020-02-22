import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {LoginModalService} from "../../services/login-modal.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService, public loginModalService: LoginModalService, public location: Location) {
  }

  logout() {
    this.authenticationService.logOut();
  }

  ngOnInit(): void {
  }


}
