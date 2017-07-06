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
import { AuthService }      from '../for-you/guard/auth.service';
import {Cookie} from "ng2-cookies/src/services/cookie";
import {AuthYouComponent} from "../for-you/guard/auth";
import {MdDialog} from "@angular/material";

@Injectable()
export class AuthGuardLogin implements CanActivate, CanActivateChild, CanLoad {
    constructor( private router: Router,
                public dialog: MdDialog) {
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
        if (Cookie.get('login_token') === null ||
            Cookie.get('login_token') === 'null' ||
            Cookie.get('login_token') === undefined) {
            return true;
        }

        // Store the attempted URL for redirecting

        // Create a dummy session id

        // Navigate to the login page with extras
        this.router.navigate(['manager']);

        return false;
    }

}

