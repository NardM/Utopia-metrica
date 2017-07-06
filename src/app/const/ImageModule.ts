/**
 * Created by nardm on 12.01.17.
 */
/**
 * Created by nardm on 19.11.16.
 */
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {JsonpModule, HttpModule} from "@angular/http";
import {Ng2BootstrapModule, RatingModule} from "ng2-bootstrap";
import {SelectModule} from "ng2-select";
import {AgmCoreModule} from "angular2-google-maps/core";
import {CarouselModule  } from "ng2-bootstrap";
import { ButtonsModule } from 'ng2-bootstrap';
import {FancyImageUploaderComponent} from "../../../../utopiasite/src/app/components/imageuploader/fancy-image-uploader.component";
import {BaPictureUploader} from "../theme/components/baPictureUploader/baPictureUploader.component";
import {FileUploader} from "../../../../utopiasite/src/app/components/imageuploader/file-uploader";


@NgModule({
  imports: [
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
    Ng2BootstrapModule,
    RatingModule,
    CarouselModule,
    SelectModule,
    ButtonsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBhk8ZsvNohjnePbf8kvVTVX3c3fWIQ0iQ",
      libraries: ["places"]
    }),
    NgbModule.forRoot(),
  ],
  declarations: [
    BaPictureUploader,
    FancyImageUploaderComponent,
  ],

  providers: [
    FileUploader
  ],
  exports: [
    BaPictureUploader,
    FancyImageUploaderComponent,
  ]
})
export class ImageModule {}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
