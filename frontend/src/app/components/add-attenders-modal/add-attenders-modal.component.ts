import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalService} from '../../services/modal.service';
import {CourseService} from '../../services/course.service';
import {EditionService} from '../../services/edition.service';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-add-attenders-modal',
  templateUrl: './add-attenders-modal.component.html',
  styleUrls: ['./add-attenders-modal.component.css']
})
export class AddAttendersModalComponent implements OnInit {


  singleAddFg: FormGroup;
  bulkAddFg: FormGroup;


  constructor(public authenticationService: AuthenticationService,
              public formBuilder: FormBuilder,
              private announcerService: AnnouncerService,
              private modalService: ModalService,
              private courseService: CourseService,
              private editionService: EditionService) {
  }

  ngOnInit(): void {
    this.singleAddFg = this.formBuilder.group({
      singleEmailCtrl: ['', [Validators.required, Validators.email]]
    });

    this.bulkAddFg = this.formBuilder.group({
      bulkEmailCtrl: ['', [Validators.required]],
      separatorCtrl: ['', [Validators.required]]
    })
  }


  async singleSubmit() {
    let email = this.singleAddFg.get('singleEmailCtrl').value;


    this.courseService.addCourseAttenders(this.editionService.getCourseAddingUsers().id, [email])
      .subscribe(resp => {
          let attendersAdded = resp.attendersAdded;

          let attendersAlreadyAdded = resp['attendersAlreadyAdded'];
          if (attendersAlreadyAdded.length > 0) {
            this.modalService.newErrorModal('The user is already in this course!', 'You tried to add a user that is already an attender of this course!', null);
          } else {
            this.modalService.newSuccessModalWithCallback('Attender added successfully!', `The attender: ${email} was added to this course`, null);
            this.announcerService.announceAttenderAddedToCourse(this.editionService.getCourseAddingUsers(), attendersAdded);
          }
        },
        error => {
          console.log(error);
        });

  }

  bulkSubmit() {

    let separator = this.bulkAddFg.get('separatorCtrl').value;
    let emails = this.bulkAddFg.get('bulkEmailCtrl').value.split(separator);

    this.courseService.addCourseAttenders(this.editionService.getCourseAddingUsers().id, emails)
      .subscribe(resp => {

          console.log(resp);

          let attendersAdded = resp.attendersAdded;
          let attendersAlreadyAdded = resp['attendersAlreadyAdded'];
          let notRegistered = resp['emailsValidNotRegistered'];
          let invalid = resp['emailsInvalid'];

          //no attenders added
          if (attendersAdded.length === 0) {

            let errorMessage = ``;

            if (attendersAlreadyAdded.length > 0) {
              errorMessage = `Already added: ${attendersAlreadyAdded.map(a => a.name)}\n`
            }

            if (notRegistered.length > 0) {
              errorMessage += `Not registered: ${notRegistered}\n`
            }

            if (notRegistered.length > 0) {
              errorMessage += `Invalid emails: ${invalid}`
            }

            this.modalService.newErrorModal('Error adding attenders!', errorMessage, null);
          }

          // at least one added
          else {
            this.modalService.newSuccessModal('Successfully added attenders!', ``, null);
            this.announcerService.announceAttenderAddedToCourse(this.editionService.getCourseAddingUsers(), attendersAdded);
          }


        },
        error => {
          this.modalService.newErrorModal(`Error adding attenders!`, JSON.stringify(error), null);
        })


  }
}
