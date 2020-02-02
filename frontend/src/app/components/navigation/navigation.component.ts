import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {LoginModalService} from "../../services/login-modal.service";
import {Location} from "@angular/common";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  // @Input('drawer')
  // public drawer: MatDrawer;

  constructor(public authenticationService: AuthenticationService, public loginModalService: LoginModalService, public location: Location) { }

  updateLoginModalView(b: boolean){
    this.loginModalService.activateLoginView(b);
  }

  //Checks if the route is "/courses".
  showFiller: any;
  isLogin: boolean = false;
  isRegister: boolean = false;



  public addSessionHidden() {
    let list = ["/courses"],
      route = this.location.path();
    return (list.indexOf(route) > -1);
  }

  logout(){
    this.authenticationService.logOut().subscribe(
      response => { $("div.drag-target").remove(); }, //This deletes the draggable element for the side menu (external to the menu itself in the DOM)
      error => console.log("Error when trying to log out: " + error)
    );
  }

  ngOnInit(): void {
  }


}
