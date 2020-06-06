import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {LoginModalService} from '../../services/login-modal.service';
import {Location} from '@angular/common';
import {User} from '../../classes/user';
import {environment} from '../../../environments/environment';

declare var VANTA;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService,
              public location: Location) {
  }

  private user: User;

  vanta;

  logout() {
    this.authenticationService.logOut();
  }

  ngOnInit(): void {
    this.authenticationService.reqIsLogged()
      .then(value => {
        if (this.isAnimatedBackgroundEnabled()) {
          this.applyVanta();
        }
        this.user = this.authenticationService.getCurrentUser();
      })
  }

  toggleVanta() {
    if (this.isAnimatedBackgroundEnabled()) {
      this.disableVanta()
    } else {
      this.applyVanta()
    }
  }

  applyVanta() {
    this.vanta = VANTA.NET({
      el: '#sticky-footer-div',
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
    });
    localStorage.setItem('apply-vanta', 'true');
  }

  disableVanta() {
    this.vanta.destroy();
    this.vanta = null;
    localStorage.removeItem('apply-vanta');
  }

  isAnimatedBackgroundEnabled() {
    return !!localStorage.getItem('apply-vanta');
  }

  getPicture() {
    return environment.API_URL + this.user.picture;
  }
}
