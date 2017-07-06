/**
 * Created by nardm on 03.01.17.
 */


import { Injectable }    from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import { Observable } from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Consts} from "../app-const";
import {Cookie} from "ng2-cookies";
import {TokenService} from "../../service/token.serviece";
import {EmptyAnswer} from "../../metrica/model/Answer";
import {createImage, resizeImage} from "../../metrica/service/utils";
import {ImageResult, ResizeOptions} from "../../metrica/model/interfaces";

@Injectable()
export class ConstService {

  constructor(private http: Http,
              private tokenService: TokenService) {
  }

  typeReturn(type, jsonRes) {
      switch (type) {
          case "categories":
              return jsonRes.data.categories;
          case "properties":
              return jsonRes.data.properties;
          case "responses":
              return jsonRes.data.responses;
          case "requests":
              return jsonRes.data.requests;
          case "reviews":
              return jsonRes.data.reviews;
          case "values":
              return jsonRes.data.values;
          case "forms":
              return jsonRes.data.forms;
          case "companies":
              return jsonRes.data.companies;
          case "services":
              return jsonRes.data.services;
          case "accounts":
              return jsonRes.data.accounts;
          case "cities":
              return jsonRes.data.cities;
          case "chats":
              return jsonRes.data.chats;
          case "users":
              return jsonRes.data.users;
          case "skins":
              return jsonRes.data.skins;
          default:
              return jsonRes.data;
      }
  }

  search<T>(url: string,  type?: string): Observable<T[]> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http
        .get(url,
          {headers: headers})
        .map(res => {
          let jsonRes = res.json();
          return this.typeReturn(type, jsonRes);
        }))
        .catch(this.handleError);
  }

  get<T>(url: string,type?: string): Promise<T> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http
        .get(url, {headers: headers})
        .map(res => {
          let jsonRes = res.json();
            if (!jsonRes.success){
                if (jsonRes.message.code === 8) {
                    Cookie.delete('login_token');
                    Cookie.delete('device_token');
                    this.tokenService.refreshToken()
                        .then(re => {
                            location.reload();
                        })
                }
            }
          return this.typeReturn(type, jsonRes);
        }))
      .toPromise()
      .catch(this.handleError);
  }


  getId<T>(url: string, id: number | string, type?: string): Promise<T> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http
        .get(url, {headers: headers})
        .map(res => {
          return this.typeReturn(type, res.json())
            .find(item => item.id === Number(id));
        }))
      .toPromise()
      .catch(this.handleError);
  }


  post<T, G>(url: string, item: T): Promise<G> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http.post(url,
        item,
        {headers: headers})
        .map(a => a.json()))
      .toPromise()
      .catch(this.handleError);
  }

  postAnswer<T>(url: string, item: T): Promise<EmptyAnswer> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http.post(url,
        item,
        {headers: headers})
        .map(a => a.json()))
      .toPromise()
      .catch(this.handleError);
  }



  put<T>(url: string, item: T): Promise<T> {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers =>
        this.http.put(url,
          item,
          {headers: headers})
          .map(a => a.json()))
      .toPromise()
      .catch(this.handleError);
  }

  postSingle<T>(url: string): Promise<T> {
      return this.tokenService.token()
          .map(token => new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          }))
          .mergeMap(headers => this.http
              .post(url, null,
                  {headers: headers})
              .map(a => a.json()))
          .toPromise()
          .catch(this.handleError);
  }

  delete(url: string) {
    return this.tokenService.token()
      .map(token => new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }))
      .mergeMap(headers => this.http
        .delete(url, {headers: headers})
        .map(a => a.json()))
      .toPromise()
      .catch(this.handleError);
  }


    _imageThumbnail: any;
    propagateChange = (_: any) => {};


    get imageThumbnail() {
        return this._imageThumbnail;
    }

    set imageThumbnail(value) {
        this._imageThumbnail = value;
        this.propagateChange(this._imageThumbnail);

    }

    getFile(url: string, authToken?: string, authTokenPrefix?: string): Observable<File> {
        return Observable.create((observer: Observer<File>) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                let contentType = xhr.getResponseHeader('Content-Type');
                let blob = new File([xhr.response], 'filename', {type: contentType});

                if (blob.size > 0) {
                    observer.next(blob);
                    observer.complete();
                } else {
                    observer.error('No image');
                    observer.complete();
                }
            };

            xhr.setRequestHeader("Authorization", `${authTokenPrefix} ${authToken}`);

            xhr.send();
        });
    }

    getAvatar(url: string, mode?: string): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            let defaultImage: string = "";
            switch (mode) {
                case 'company':
                    defaultImage = 'assets/icon/IconFirm.png';
                    break;
                case 'iconClinet':
                    defaultImage  = 'assets/icon/client.png';
                    break;
                default:
                    break;
            }
            this.getFile(Consts.baseURL + url, Cookie.get('login_token'), 'Bearer')
                .subscribe(file => {
                    // thumbnail
                    let result: ImageResult = {
                        file: file,
                        url: URL.createObjectURL(file)
                    };

                    /* this.resize(result).then(r => {
                     this._imageThumbnail = r.resized.dataURL;
                     });
                     */
                    this.fileToDataURL(file, result).then(r => {
                        observer.next(r.dataURL);
                    });
                });
        });
    }

    private resize(result: ImageResult): Promise<ImageResult> {
        let resizeOptions: ResizeOptions = {
            resizeType: result.file.type,
        };

        return new Promise((resolve) => {
            createImage(result.url, image => {
                let dataUrl = resizeImage(image, resizeOptions);

                result.width = image.width;
                result.height = image.height;
                result.resized = {
                    dataURL: dataUrl,
                    type: this.getType(dataUrl)

                };

                resolve(result);
            });
        });
    }

    private getType(dataUrl: string) {
        return dataUrl.match(/:(.+\/.+;)/)[1];
    }

    private fileToDataURL(file: File, result: ImageResult): Promise<ImageResult> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function (e) {
                result.dataURL = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }


    private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}

