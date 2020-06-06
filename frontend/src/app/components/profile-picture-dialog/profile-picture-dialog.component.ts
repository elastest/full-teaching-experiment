import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../../classes/user';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {FileService} from '../../services/file.service';
import {ModalService} from '../../services/modal.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-profile-picture-dialog',
  templateUrl: './profile-picture-dialog.component.html',
  styleUrls: ['./profile-picture-dialog.component.css']
})
export class ProfilePictureDialogComponent implements OnInit {
  fileToUpload: File = null;
  private user: User;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private fileService: FileService) {
    this.user = data['user'];
  }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  upload(){
    this.fileService.changeProfilePicture(this.user, this.fileToUpload)
      .subscribe(resp => {
        console.log(resp)
        this.modalService.newSuccessModal(`Profile picture changed!`, ``, null);
        this.authenticationService.getCurrentUser().picture = resp.picture;

      }, error => {
        console.log(error);
        this.modalService.newErrorModal(`Error uploading picture!`, ``, null);
      });
  }
}
