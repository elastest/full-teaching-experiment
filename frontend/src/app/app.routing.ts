
import { PresentationComponent } from './components/presentation/presentation.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VideoSessionComponent } from './components/video-session/video-session.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from "./components/login/login.component";
import {IndexPageComponent} from "./components/index-page/index-page.component";
import {RegisterComponent} from "./components/register/register.component";
import {DashboardV2Component} from "./components/dashboard-v2/dashboard-v2.component";
import {CourseDetailsV2Component} from "./components/course-details-v2/course-details-v2.component";

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
  },

  {
    path: 'courses',
    component: DashboardV2Component
  },
  {
    path: 'courses/:id/:tabId',
    component: CourseDetailsV2Component
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'session/:id',
    component: VideoSessionComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'index',
    component: IndexPageComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
