import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Comment} from "../classes/comment";

const Swal = require('sweetalert2');


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private router: Router) {
  }


  public newSuccessModal(title: string, text: string, redirect: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      onClose: () => {
        if (redirect) {
          this.router.navigate([redirect]);
        }
      }
    });
  }


  public newErrorModal(title: string, text: string, redirect: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      onClose: () => {
        if (redirect) {
          this.router.navigate([redirect]);
        }
      }
    });
  }

  public newLogoutModal() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'You logged out!',
      showConfirmButton: false,
      timer: 1500
    })
  }


  public newReplyModal(comment: Comment, onAccept: Function) {
    Swal.fire({
      title: 'Your response:',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      },
    })
      .then(result => {
        onAccept(result);
      })
  }

  newToastModal(title: string) {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: title
    })
  }
}
