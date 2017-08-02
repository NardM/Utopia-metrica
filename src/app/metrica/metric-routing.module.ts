/**
 * Created by nardm on 19.11.16.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from "./metric.component";
import {BusinessMapsComponent} from "./maps/maps.component";
import {TablePaginationExample} from "./companies-table/companies-table.component";
import {BusinessTableComponent} from "./table/maps.component";


const managerRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                children: [
                  { path: '', component: BusinessMapsComponent },
                  { path: 'maps', component: BusinessMapsComponent },
                  { path: 'tabl', component: TablePaginationExample },
                  { path: 'table', component: BusinessTableComponent },
                ]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(managerRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MetricRoutingModule {}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
