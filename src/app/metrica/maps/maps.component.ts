import {Component, Inject, OnInit} from "@angular/core";
import {LatLngBoundsLiteral, LatLngLiteral} from "angular2-google-maps/core";
import {RequestInterface} from "../../models/Request";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Companies, CompanyI} from "../model/company";
import {CompanyService} from "../service/company.service";
declare var google:any;




@Component({
    selector: 'business-maps',
    templateUrl: 'maps.component.html',
    styleUrls: ['maps.component.scss'],
})




export class BusinessMapsComponent implements OnInit {

  public origin: any = {longitude: 4.333, latitude: -1.2222};  // its a example aleatory position
  public destination: any = {longitude: 22.311, latitude: -0.123};  // its a example aleatory position
  public latitude: number;
  public longitude: number;
  public zoom: number;
  duration: string;
  distance: string;
  paths: Array<LatLngLiteral> = [];
  bounds: LatLngBoundsLiteral;
  originText: string = "";
  destinationText: string = "";


  public companies: CompanyI[];

  constructor(private companyService: CompanyService) {
  }






  ngOnInit() {
    //set google maps defaults
    debugger;
    this.zoom = 12;
    let self = this;
    self.companyService.getCompanies(0, 300)
        .then(res=> this.companies = res);
  }

}
