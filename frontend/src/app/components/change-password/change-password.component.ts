import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  public formComplete: boolean = false;
  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.changePwFg = this.formBuilder.group({
      'actual': ['', [Validators.required]],
      'password': ['', Validators.required],
      'confirmation': ['', Validators.required],
    }, {
      validator: this.checkPasswords
    });
  }

  public changePwFg: FormGroup;


  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmation').value;
    return pass === confirmPass ? null : {notSame: true}
  }

  changed() {
    this.formComplete = !this.changePwFg.invalid;
  }

  changePassword() {

    let current = this.changePwFg.get('actual').value;
    let newPass = this.changePwFg.get('password').value;

    this.userService.changePassword(current, newPass).subscribe(
      result => {
        //Password changed succesfully
        console.log("Password changed succesfully!");
        this.modalService.newSuccessModal('Password changed successfully!', 'You have successfully modified your password!', null);
      },
      error => {
        console.log(error)
        console.log("Password change failed (error): " + error);
        if (error.status === 304) { //NOT_MODIFIED: New password not valid
          let errorTitle = 'Your new password does not have a valid format!';
          let errorContent = 'It must be at least 8 characters long and include one uppercase, one lowercase and a number';
          this.modalService.newErrorModal(errorTitle, errorContent, null);
        }
        else if (error.status === 409) { //CONFLICT: Current password not valid
          let errorTitle = 'Invalid current password';
          let errorContent = 'The server has rejected your password';
          this.modalService.newErrorModal(errorTitle, errorContent, null);
        }
      }
    );
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
