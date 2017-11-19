  /**
 * Created by nardm on 26.01.17.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from "ng2-cookies";
import {CompanyI} from "../../metrica/model/company";
declare var jQuery:any;

@Injectable()
export class RequestMetricHub {


  public newCompany: Observable<CompanyI>;

  constructor() {
    let connection = jQuery.connection;
    let host = "r.smartapi.ru";
    jQuery.connection.hub.url = 'http://' + host + '/signalr';
    debugger;
    let metricaHub = connection.metrica;

    this.newCompany = Observable.create(observer =>
        metricaHub.client.newCompany = ( a => observer.next(a)));

    connection.hub.start()
        .done(function () {
          let connect: Connect = <Connect>{
            device_id: Cookie.get('device_id'),
            role: 8,
            app_type: 6,
            token: Cookie.get('login_token')
          };
          connection.metrica.server.connect(connect).done(res => {
            debugger;
          });
        })
        .fail(function () {
          debugger;
          console.log('Could not Connect!');
        });
  }
}

export interface Connect{
  device_id: string;
  role: number;
  app_type: number;
  user_id: number;
  token: string;
}
