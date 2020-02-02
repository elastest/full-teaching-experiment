import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
const Swal = require('sweetalert2');


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private router: Router) { }



  public newSuccessModal(title: string, text: string, redirect: string){
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      onClose: () => {
        if(redirect){
          this.router.navigate([redirect]);
        }
      }
    });
  }


  public newErrorModal(title: string, text: string, redirect: string){
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      onClose: () => {
        if(redirect){
          this.router.navigate([redirect]);
        }
      }
    });
  }

}
