import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  public registerFormGroup: FormGroup;


  constructor(private formBuilder: FormBuilder,
              public authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private modalService: ModalService) {
  }


  checkPasswords() { // here we have the 'passwords' group
    console.log(`Checking passwords!`);
    let pass = this.registerFormGroup.get('password').value;
    let confirmPass = this.registerFormGroup.get('confirm-password').value;
    return confirmPass && pass && confirmPass === pass;
  }

  createForm() {
    this.registerFormGroup = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'name': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'confirm-password': ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.createForm()
  }


  onSubmit(post) {


    if(!this.checkPasswords()){
      this.modalService.newErrorModal('Passwords dont match!', 'You must enter the same password in both fields!', null);
      return;
    }

    let email = post['email'];
    let password = post['password'];
    let name = post['name'];

    console.log(`Calling register for user ${email}`);

    this.userService.newUser(email, password, name, '').subscribe(resp => {
        console.log('User registered!');
        this.modalService.newSuccessModal('Successfully registered!', 'Now you can login with your account!', '/login');
      },
      error => {

        let status = error.status;
        let errorTitle = '';
        let errorContent = '';
        let redirect = null;

        switch (status) {
          case 409:
            errorTitle = 'Invalid email';
            errorContent = 'That email is already in use';
            break;
          case 400:
            errorTitle = 'Invalid password format';
            errorContent = 'Our server has rejected that password';
            break;
          case 403:
            errorTitle = 'Invalid email format';
            errorContent = 'Our server has rejected that email';
            break;
          case 401:
            errorTitle = 'Captcha not validated!';
            errorContent = 'I am sorry, but your bot does not work here :)';
            break;
        }


        this.modalService.newErrorModal(errorTitle, errorContent, redirect);

      });
  }


}
