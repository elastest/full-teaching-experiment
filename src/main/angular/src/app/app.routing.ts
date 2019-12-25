
import { PresentationComponent } from './components/presentation/presentation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VideoSessionComponent } from './components/video-session/video-session.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
  },

  {
    path: 'courses',
    component: DashboardComponent
  },
  {
    path: 'courses/:id/:tabId',
    component: CourseDetailsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'session/:id',
    component: VideoSessionComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
