/**
 * Created by nardm on 07.11.16.
 */
import { Observable } from "rxjs/Observable";
import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Consts} from "../../const/app-const";
import {ConstService} from "../../const/http/service-const.service";
import { Logout } from '../../login/login.service';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class ClientService {


  private clientsUrl = Consts.baseURL + 'manage/v1/account';  // URL to web api
  private clientUrl = Consts.baseURL + 'manage/v1/account/';  // URL to web api

  constructor(private constService: ConstService) {
  }

  getClients(offset?: number): Promise<Account[]> {
    let url = this.clientsUrl+'?count=100&offset='+offset;
    return this.constService.get<Account[]>(url, 'accounts');
  }


  onLogout(){
    let url = `${Consts.baseURL}v1/account/logout`;
    let device_id = Cookie.get('device_id');
    let logout: Logout = <Logout> {
      device_id: device_id,
      app_type: 5,
    };
    return this.constService.post<Logout, LogoutGet>(url, logout)

  }

  getAccount(): Promise<Account> {
    let url = `${Consts.baseURL}v1/account`;
    return this.constService.get<Account>(url);
  }

  getClient(id: number): Promise<Account> {
    let url = this.clientsUrl + '/' + id;
    return this.constService.get<Account>(url);
  }

  blockAccount(userId: number, rezon: string): Promise<any> {
    let url = this.clientsUrl + '/' + userId +'/block';
    return this.constService.post(url, rezon);
  }



  OnblockAccount(userId: number, rezon: string): Promise<any> {
    let url = this.clientsUrl + '/' + userId +'/block';
    return this.constService.delete(url);
  }

}

export interface LogoutGet {
  access_token: string;
  token_type: string;
  expires_in: number;
  settings: Settings;
  user_id: number;
  token_hash: string;
}
export interface Settings {
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
