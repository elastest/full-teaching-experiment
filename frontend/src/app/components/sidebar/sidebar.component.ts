import { Component, OnInit } from '@angular/core';
import {Menuitem} from "../../classes/menuitem";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../classes/user";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }
  public menuItems: Array<any> = new Array<any>();

  ngOnInit() {
    this.menuItems.push(new Menuitem('My courses', '', 'book'));
    this.menuItems.push(new Menuitem('My calendar', '', 'calendar_today'));
    this.menuItems.push(new Menuitem('My students', '', 'people'));
  }

}
