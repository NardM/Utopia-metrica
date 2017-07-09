/**
 * Created by nardm on 30.05.17.
 */
/**
 * Created by nardm on 08.12.16.
 */
import { Component } from '@angular/core';
import {UserService} from "../../http/user.service";
import {GlobalState} from "../../global.state";

@Component({
    selector: 'left-bar',
    templateUrl: 'left-bar.component.html',
     styleUrls: ['left-bar.component.scss']
})
export class LeftBarComponent {


    constructor(private _state:GlobalState) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public isMenuCollapsed:boolean = false;

    public toggleMenu(): boolean {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public navLinks: { href: string, label: string, icon: string }[] = [
        {
            href: './maps', label: 'Карта', icon: 'map'
        },
        {
            href: './table', label: 'Таблицы', icon: 'tab'
        },
    ];
}
