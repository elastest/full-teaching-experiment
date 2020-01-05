import {Component, OnInit} from '@angular/core';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  ngOnInit(): void {
    document.body.classList.add('bg-img-login');
  }

}
