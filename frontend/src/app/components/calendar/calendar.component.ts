import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Session} from '../../classes/session';
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {Moment} from "moment";
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'calendar-app',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit {


  @ViewChild(MatCalendar)
  private calendar: MatCalendar<Date>;
  private sessions: Array<Session> = new Array<Session>();
  today: Date = new Date();
  selectedDate: Moment;


  constructor(private authService: AuthenticationService, private courseService: CourseService) {
  }


  ngOnInit(): void {
    this.loadAllSessions();
  }

  loadAllSessions(){
    this.courseService.getCourses(this.authService.getCurrentUser()).subscribe(resp =>{
      resp.forEach(c => {
        c.sessions.forEach(s => {
          s.course = c;
          this.sessions.push(s);
        })

        this.calendar.updateTodaysDate();

      })
    });
  }

  getAllSessions(){
    return this.sessions;
  }

  monthSelected(event) {
    console.log(event)
  }

  clickedDay(event: Moment) {
    this.isSessionDate(event)
  }

  ngAfterViewInit(): void {
  }

  isSessionDate(date: Moment): Boolean {

    let day = date.date();
    let month = date.get("month");

    let sessions = this.getAllSessions();

    return sessions.filter(session => {
      let sessionDate = new Date(session.date);
      return sessionDate.getDay() === day && sessionDate.getMonth() === month;
    }).length > 0;
  }

  dateClass = (d: Moment): MatCalendarCellCssClasses => {
    // Highlight the 1st and 20th day of each month.
    if (this.isSessionDate(d)) {
      return 'session-custom-date';
    }
    return ''
  }


}

