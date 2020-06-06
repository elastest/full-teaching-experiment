import {Component, OnInit} from '@angular/core';

import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../classes/user';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {ModalService} from '../../services/modal.service';
import {UserService} from '../../services/user.service';
import {ProfilePictureDialogComponent} from '../profile-picture-dialog/profile-picture-dialog.component';
import {environment} from '../../../environments/environment';

declare var Materialize: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public user: User;

  constructor(
    public matDialog: MatDialog,
    public authenticationService: AuthenticationService) {
  }

  openChangePasswordDialog() {
    this.matDialog.open(ChangePasswordComponent, {
      width: '75vh',
    });
  }

  ngOnInit() {
    this.authenticationService.checkCredentials()
      .then(() => {
        this.user = this.authenticationService.getCurrentUser();
      })
      .catch((e) => {
      });
  }

  openProfilePictureUploader() {
    this.matDialog.open(ProfilePictureDialogComponent, {
      width: '75vh',
      data: {
        user: this.user
      }
    });
  }

  getProfilePicture() {
    return this.authenticationService.getCurrentUser().picture ? `${environment.API_URL}${this.authenticationService.getCurrentUser().picture}` : 'assets/images/default_session_image.png';
  }
}
