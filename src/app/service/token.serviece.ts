import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {GUID} from "../../guid/guid";
import {Consts} from "../../const/app-const";
import {Cookie} from "ng2-cookies/ng2-cookies";
import {Observable} from "rxjs/Observable";
import { Device } from 'ng2-device-detector';
import { Router } from '@angular/router';

@Injectable()
export class TokenService {
  private static deviceIdKey: string = 'device_id';
  private deviceToken: string;
  private tokenUrl = Consts.baseURL + 'v1/device';
  private refreshTokenUrl = Consts.baseURL + 'v1/account/token/refresh';
  private headers = new Headers({'Content-Type': 'application/json'});
  private tokenPromise: Promise<String>;
  private tokenObservable: Observable<String>;
  public loginToken: String;

  constructor(private http: Http,
              private router: Router,
              ) {
  }


  public token(): Observable<String> {
    this.loginToken = Cookie.get('login_token');
    this.deviceToken = Cookie.get('device_token');
    if (this.loginToken !== null && this.loginToken !== "null" && this.loginToken !== undefined) {
      return Observable.of(this.loginToken);
    }
    if (this.deviceToken !== null && this.deviceToken !== "null" && this.deviceToken !== undefined) {
      return Observable.of(this.deviceToken);
    }
    let date = new Date('Tue May 23 2027 17:50:27 GMT+0300 (MSK)');
    let deviceId: string = Cookie.get(TokenService.deviceIdKey);
    if (deviceId == null) {
      deviceId = GUID.getNewGUIDString().toString();
      Cookie.set('device_id', deviceId, 30239999);
    }
    let params = {
      'device_id': deviceId,
      'device_type': '3',
      'os_version': 'asd',
      'app_version': '1.0.1',
      'app_type': '5',
      'app_build': 1
    };

    return this.http
        .post(this.tokenUrl, JSON.stringify(params), {headers: this.headers})
        .map(a => {
          let response = a.json();
          if (response.success) {
            this.deviceToken = response.data.access_token;
            Cookie.set('device_token', response.data.access_token, 30239999);
            this.tokenPromise = null;
            return response.data.access_token;
          }
          else {
            return null;
          }
        });
  }


  public refreshToken(): Promise<any> {
    this.loginToken = Cookie.get('login_token');
    this.deviceToken = Cookie.get('device_token');
    let date = new Date('Tue May 23 2027 17:50:27 GMT+0300 (MSK)');
    let deviceId: string = Cookie.get('device_id');
    if (deviceId == null) {
      deviceId = GUID.getNewGUIDString().toString();
      Cookie.set('device_id', deviceId, 30239999);
    }
    let params = {
      'device_id': deviceId,
      'device_type': '3',
      'os_version': 'asd',
      'app_version': '1.0.1',
      'app_type': '5',
      'app_build': 1
    };
    let token: string = Cookie.get('login_token');
    debugger;
    return this.http
        .post(this.refreshTokenUrl, JSON.stringify(params), {
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .map(a => {
          let response = a.json();
          if (response.success) {
            this.saveLoginToken(response.data.access_token, response.data.expires_in);
          }
          else {
            this.router.navigate(['login']);
          }
        })
        .toPromise();
  }

  saveLoginToken(token: String, expires_in: number): String {
    debugger;
    this.loginToken = token;
    Cookie.set('login_token', token.toString(), expires_in);
    return token;
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
