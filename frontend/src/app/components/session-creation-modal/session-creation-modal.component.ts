import {Component, Inject, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FTSession} from '../../classes/FTSession';
import {SessionService} from '../../services/session.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../course-attachments/course-attachments.component';
import {Course} from '../../classes/course';
import {ModalService} from '../../services/modal.service';
import {AnnouncerService} from '../../services/announcer.service';

@Component({
  selector: 'app-session-creation-modal',
  templateUrl: './session-creation-modal.component.html',
  styleUrls: ['./session-creation-modal.component.css']
})
export class SessionCreationModalComponent implements OnInit {

  public formGroup: FormGroup;
  public course: Course;


  constructor(private formBuilder: FormBuilder,
              private modalService: ModalService,
              private announcer: AnnouncerService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private sessionService: SessionService) {
    this.formGroup = formBuilder.group({
      titleCtrl: ['', [Validators.required]],
      descCtrl: ['', [Validators.required]],
      dateCtrl: ['', [Validators.required]]
    });
    this.course = this.data.course;
  }

  ngOnInit(): void {
  }

  changeDate($event: MatDatepickerInputEvent<any>) {

  }

  saveButtonEnabled(){
    return this.formGroup.valid;
  }

  today() {
    return new Date();
  }

  myFilter = (d: Date | null): boolean => {
    const date = d['_d'];
    const day = date.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && date > this.today();
  }

  createSession() {

    const date = this.formGroup.get('dateCtrl').value;
    const title = this.formGroup.get('titleCtrl').value;
    const desc = this.formGroup.get('descCtrl').value;

    const session = new FTSession(title, desc, date['_d'].getTime())
    this.sessionService.newSession(session, this.course.id)
      .subscribe(resp => {
        this.modalService.newToastModal('Session created successfully!');
        this.announcer.announceSessionCreated(resp.sessions);
      }, error => {
        this.modalService.newErrorModal(`Error creating session!`, JSON.stringify(error), null);
      })
  }
}
