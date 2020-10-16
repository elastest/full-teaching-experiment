import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../classes/user';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: ModalService) {
  }

  createForm() {
    this.loginFormGroup = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    });
  }

  onSubmit() {
    let email = this.loginFormGroup.value['email'];
    let password = this.loginFormGroup.value['password'];

    console.log(`Calling login for user ${email}`);

    this.authenticationService.logIn(email, password).subscribe(
      (result: User) => {
        this.router.navigate(['/courses']);
      },
      error => {
        console.log(error)
        let status = error.status;
        console.log(`Login error with status ${status}`);
        let title = 'Login error!';
        let content = 'Please check your email or password';
        this.modalService.newErrorModal(title, content, null);
      });
  }

  ngOnInit(): void {
    this.createForm()
  }

  getError(el) {
    switch (el) {
      case 'email':
        if (this.loginFormGroup.get('email').invalid && this.loginFormGroup.get('email').touched) {
          return 'Introduce a valid email!';
        }
        break;
      case 'pass':
        if (this.loginFormGroup.get('password').hasError('required')) {
          return 'Password required';
        }
        break;
      default:
        return '';
    }
  }
}
