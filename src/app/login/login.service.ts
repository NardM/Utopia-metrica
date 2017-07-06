import {Injectable} from "@angular/core";
import {TokenYouService} from "./token-service";
import {Headers, Http} from "@angular/http";
import {Cookie} from "ng2-cookies";
import {ConstService} from "../const/http/service-const.service";
import {EmptyAnswer} from "../manager/http/answer";
import {TokenService} from "../manager/http/token.serviece";
import {Consts} from "../const/app-const";

export interface Logout{
    device_id: string;
    app_type: number;
}

@Injectable()
export class LoginService {

    constructor(private   http: Http,
                private  tokenService: TokenService,
                private constService: ConstService) {
    }

    logout(): void {
        let url = Consts.baseURL + 'v1/account/logout';
        let device_id = Cookie.get('device_id');
        let logout = {
            'device_id': device_id,
            'app_type': '4',
        };
        this.constService.post(url, JSON.stringify(logout));
        Cookie.deleteAll();
        localStorage.clear();
        this.tokenService.loginToken = null;
    }

    login(phone: String): Promise<EmptyAnswer> {
        return this.tokenService.token()
            .map(token => new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }))
            .mergeMap(headers => this.http.post(Consts.baseURL + `v1/account/login`,
                new LoginModel(phone),
                {headers: headers})
                .map(a => a.json()))
            .toPromise()
            .catch(LoginService.handleError);
    }

    confirm(phone: string, code: number): Promise<EmptyAnswer> {
        let self = this;
        let res = self.tokenService.token();
        return res.map(t => {
            return new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + t
            });
        })
            .mergeMap(headers => self.http.post(Consts.baseURL + `v1/account/confirm`,
                new ConfirmModel(phone, code.toString()),
                {headers: headers})
                .map(a => {
                    if (a.json().success) {
                        self.tokenService.saveLoginToken(a.json().data.access_token, a.json().data.expires_in)
                    }
                    return a.json()
                })
            )
            .toPromise()
            .catch(LoginService.handleError);
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
export class LoginModel{
    constructor(public phone: String){}
}

export class ConfirmModel{
    constructor(
        private  phone: string,
        private code: string
    ){}
}
