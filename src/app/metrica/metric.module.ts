/**
 * Created by nardm on 19.11.16.
 */
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import {ManagerRoutingModule}     from './metric-routing.module'
import {UserComponent} from "./metric.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonpModule, HttpModule} from "@angular/http";
import {AgmCoreModule} from "angular2-google-maps/core";
import {MaterialModule} from "@angular/material";
import {BusinessMapsComponent} from "./maps/maps.component";
import {TopBarComponent} from "./theme/top-bar/top-bar.component";
import {GlobalState} from "./global.state";
import {LeftBarComponent} from "./theme/left-bar/left-bar.component";
import {CompanyService} from "./service/company.service";
import {ClientService} from "./service/client.service";
import {BaThemeSpinner} from "../service/baThemeSpinner.service";


@NgModule({
  imports: [
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    CommonModule,
    ManagerRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCxiuwoUIExQq3LaN5Kj-vNBDeyus6-t7U",
      libraries: ["geometry","places"],
      region: 'ru'
    }),
    MaterialModule,
  ],
  declarations: [
    UserComponent,
    BusinessMapsComponent,
    TopBarComponent,
    LeftBarComponent,


  ],
  entryComponents: [
  ],
  providers: [
    GlobalState,
    CompanyService,
    ClientService,
    BaThemeSpinner
  ],
  exports: []

})
export class ManagerModule {}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
