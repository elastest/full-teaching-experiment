import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

const Swal = require('sweetalert2');


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private router: Router) {
  }


  public newNotificationModal(message: string, onAccept: Function){
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: message,
      confirmButtonText: 'Open',
      timer: 5000
    })
      .then((accepted) => {
        if (accepted.value) {
          onAccept();
        }
      })
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

  public newSuccessModalWithCallback(title: string, text: string, callback: Function) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      onClose: () => {
        if (callback) {
          callback();
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


  public newInputCallbackedModal(title, onAccept: Function) {
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

  public newCallbackedModal(title: string, onAccept: Function) {
    Swal.fire({
      title: title,
      icon: 'warning',
      text: 'You won\'t be able to revert this!',
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true
    })
      .then((accepted) => {
        if (accepted.value) {
          onAccept();
        }
      })
  }

  public newMultiStageModalWithCallback(titles: Array<string>, progressSteps: Array<string>, callback: Function) {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: progressSteps
    }).queue(titles).then((result) => {
      if (result.value) {
        callback(result);
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
      customClass: 'swal-wide',
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

  showAnimatedDialog(content: string) {
    Swal.fire({
      title: content,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }

  public notificationDialog(title: string, text: string, confirmButtonText: string, onAccept: Function) {
    Swal.fire({
      title: title,
      icon: 'info',
      text: text,
      confirmButtonText: confirmButtonText,
      showCancelButton: true
    })
      .then((accepted) => {
        if (accepted.value) {
          onAccept();
        }
      })
  }

}
