/**
 * Created by nardm on 30.07.17.
 */
/**
 * Created by nardm on 05.02.17.
 */
/**
 * Created by nardm on 03.02.17.
 */
/**
 * Created by nardm on 17.11.16.
 */
import {Injectable} from "@angular/core";

import "rxjs/add/operator/toPromise";
import {Observable, Observer} from "rxjs";
import {CompanyI} from "../model/company";


@Injectable()
export class MetricaStore {

    constructor() {

        this.inited = false;
        this.storeItems = [];
        this.observers = [];
        this.observables = [];
        this.createObserver().subscribe(a => this.storeItems.push(a));
    }



    public Added(company: CompanyI) {
        this.observers.map(o =>
            o.next(new StoreItem<CompanyI>(company, StoreAction.Inserted)));
    }


    private inited;

    public createObserver() {
        let observer = Observable.create(r => {
            this.storeItems.map(si => r.next(si));
            this.observers.push(r);
        });
        this.observables.push(observer);
        return observer;
    }

    storeItems: StoreItem<CompanyI>[];
    private observers: Array<Observer<StoreItem<CompanyI>>>;
    public observables: Array<Observable<StoreItem<CompanyI>>>;
}

export class StoreItem<T>{
    constructor(public item:T,
                public action:StoreAction){

    }

}
export enum StoreAction{
    Inserted,Deleted
}
/**
 * Created by nardm on 05.02.17.
 */
