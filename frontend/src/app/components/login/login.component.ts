import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../classes/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public loginFormGroup : FormGroup;


  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  createForm() {
    this.loginFormGroup = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    });
  }

  onSubmit(post) {
    let email = post['email'];
    let password = post['password'];

    console.log(`Calling login for user ${email}`);

    this.authenticationService.logIn(email, password).subscribe(
      (result: User) => {
        console.log("Login succesful! LOGGED AS " + this.authenticationService.getCurrentUser().name);
        this.router.navigate(['/courses']);
      },
      error => {
        console.log("Login failed (error): " + error.toString());
      });
  }

  ngOnInit(): void {
    document.body.classList.add('bg-img-login');
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
