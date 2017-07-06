/**
 * Created by nardm on 13.01.17.
 */
import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import {Cookie} from "ng2-cookies/src/services/cookie";
import { ClientService } from '../manager/http/client.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  public managerSuccess: boolean;
  constructor(private authService: AuthService,
              private router: Router,
              private guard: ClientService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    debugger;
    if (Cookie.get('login_token') !== null &&
        Cookie.get('login_token') !== 'null'&&
        Cookie.get('login_token') !== undefined) {
      if (this.managerSuccess === undefined) {
        this.guard.getAccount()
            .then(res => {
              debugger;
              if (res.roles.indexOf('manager') !== -1 || res.roles.indexOf('admin') !== -1) {
                this.managerSuccess = true;
                return true;
              }
              else {
                this.managerSuccess = false;
                Cookie.deleteAll();
                localStorage.clear();
                this.router.navigate(['/login']);
                return false;
              }
            });
      }
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: {'session_id': sessionId},
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }
}

