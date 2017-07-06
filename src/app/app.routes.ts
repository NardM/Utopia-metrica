import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import {AuthGuardLogin} from "./login/LoginGuard";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth-guard.service";

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'metric',
    loadChildren: 'app/metrica/metric.module#MetricModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardLogin]
  },
  { path: '**',    component: NoContentComponent },
];
