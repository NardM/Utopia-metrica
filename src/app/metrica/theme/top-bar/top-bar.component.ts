/**
 * Created by nardm on 30.05.17.
 */
/**
 * Created by nardm on 08.12.16.
 */
import { Component } from '@angular/core';
import {GlobalState} from "../../global.state";
import {ClientService} from "../../service/client.service";
import {ClientInterface} from "../../model/client";
import Account = ClientInterface.Account;
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';

@Component({
    selector: 'top-bar',
    templateUrl: 'top-bar.component.html',
     styleUrls: ['top-bar.component.scss']
})
export class TopBarComponent {

    public isMenuCollapsed: boolean = false;
    public account: Account;

    constructor(private _state: GlobalState,
                private router: Router,
                private service: ClientService) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.service.getAccount()
            .then(res => {
                Cookie.set('user_id', res.id.toString());
            })
    }

    public onLogout(): void {
        this.service.onLogout()
            .then(res => {
                Cookie.delete('login_token');
                Cookie.set('device_token', res.access_token);
                localStorage.clear();
                this.router.navigate(['login']);
            });
    }

    public onCollapse(): boolean {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }
}
