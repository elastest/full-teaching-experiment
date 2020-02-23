import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Comment} from "../classes/comment";
import {Course} from "../classes/course";
import {User} from "../classes/user";

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


  public newCallbackedModal(title, onAccept: Function){
    Swal.fire({
      title: title,
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

  public newMultiStageModalWithCallback(titles: Array<string>, progressSteps: Array<string>, callback: Function, confirmTitle: string){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: progressSteps
    }).queue(titles).then((result) => {
      if (result.value) {
        callback(result);
        // const answers = JSON.stringify(result.value);
        // Swal.fire({
        //   title: confirmTitle,
        //   showConfirmButton: true,
        //   confirmButtonText: 'Confirm',
        //   showCancelButton: true
        // })
        //   .then(isConfirm => {
        //     if(isConfirm){
        //     }
        //   })
      }
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
