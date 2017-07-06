/**
 * Created by nardm on 13.01.17.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  public isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  login(): void {
    this.isLoggedIn = true;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
