import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FTSession} from '../../classes/FTSession';
import {MatCalendar, MatCalendarCellCssClasses} from '@angular/material/datepicker';
import {Moment} from 'moment';
import {CourseService} from '../../services/course.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'calendar-app',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit {


  @ViewChild(MatCalendar)
  private calendar: MatCalendar<Date>;

  @ViewChild(SwalComponent)
  private swal: SwalComponent;

  private sessions: Array<FTSession> = new Array<FTSession>();
  today: Date = new Date();
  selectedDate: Moment;


  constructor(private authService: AuthenticationService, private courseService: CourseService, public router: Router) {
  }


  ngOnInit(): void {
    this.authService.checkLoggedIn()
      .then(() => {
        this.loadAllSessions();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  loadAllSessions() {
    this.courseService.getCourses(this.authService.getCurrentUser()).subscribe(resp => {
      resp.forEach(c => {
        c.sessions.forEach(s => {
          s.course = c;
          this.sessions.push(s);
        });

        this.calendar.updateTodaysDate();

      })
    });
  }

  getAllSessions() {
    return this.sessions;
  }

  getSessionsInSelectedDay(selectedDate: Moment) {

    let day = selectedDate.date();
    let month = selectedDate.month();
    let year = selectedDate.year();

    return this.getAllSessions().filter(session => {
      let sessionDate = this.numberToDate(session.date);
      return sessionDate.getDate() === day && sessionDate.getMonth() === month && sessionDate.getFullYear() === year;
    });
  }

  clickedDay(event: Moment) {
    if (this.isSessionDate(event)) {
      this.swal.fire()
    }
  }

  ngAfterViewInit(): void {
  }

  isSessionDate(date: Moment): Boolean {
    let sessionsThisDay = this.getSessionsInSelectedDay(date);
    return sessionsThisDay.length > 0;
  }

  dateClass = (d: Moment): MatCalendarCellCssClasses => {
    // Highlight the 1st and 20th day of each month.
    if (this.isSessionDate(d)) {
      return 'session-custom-date';
    }
    return ''
  }


  numberToDate(date: number) {
    return new Date(date);
  }
}

