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
        this.zoom = 12;
        let self = this;
        self.companyService.getCompanies(0, 300)
            .then(res => {
                let i: number = 0;
                res.map(company => {
                    debugger;

                    if (company.address.location === null || company.address.location === undefined) {
                        res.splice(i, 1);
                    }
                    i++;
                });
                i = 0;
                res.map(company => {
                    debugger;
                    if (company.address.location.lng === null ||
                        company.address.location.lng === undefined ||
                        company.address.location.lat === null ||
                        company.address.location.lat === undefined) {
                        res.splice(i, 1);
                    }
                    i++;
                });
                this.companies = res;

            });
    }
    private   setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let self = this;
                self.latitude = position.coords.latitude;
                self.latitude = position.coords.latitude;
                this.zoom = 12;
            });
        }

}
