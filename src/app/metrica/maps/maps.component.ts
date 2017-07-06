import {Component, Inject, OnInit} from "@angular/core";
import {LatLngBoundsLiteral, LatLngLiteral} from "angular2-google-maps/core";
import {RequestInterface} from "../../models/Request";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Category, Companies, CompanyI} from "../model/company";
import {CategoryI, CompanyService} from "../service/company.service";
import {ConstService} from "../../const/http/service-const.service";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
declare var google:any;




@Component({
    selector: 'business-maps',
    templateUrl: 'maps.component.html',
    styleUrls: ['maps.component.scss'],
})




export class BusinessMapsComponent implements OnInit {

    public latitude: number;
    public longitude: number;
    public zoom: number;
    public companies: CompanyI[] = [];
    private categories: CategoryI[] = [];

    constructor(private companyService: CompanyService,
                private service: ConstService) {
    }


    ngOnInit() {
        //set google maps defaults
        this.zoom = 12;
        let self = this;
        self.latitude = 55.7993562;
        self.longitude = 49.1059988;
        self.setCurrentPosition();
        let categories: Array<{name: string, id: number}> = [];
        self.companyService.getCategories()
            .then((res: CategoryI[])=>{
                res.map(category=>{
                   if (category.subcategories.length===0){
                       categories.push({name: category.name, id: category.id});
                   }
                   else{
                        category.subcategories.map(item=>{
                            categories.push({name: item.name, id: item.id});
                        })
                   }
                });
            })
            .then(()=>{
                self.companyService.getCompanies(0, 300)
                    .then(res => {
                        let i: number = 0;
                        res.map(company => {
                            if (company.address.location == null ||
                                company.address.location === undefined) {
                                res.splice(i, 1);
                            }
                            i++;
                        });
                        i = 0;
                        res.map(company => {
                            if (company.address.location.lng !== null &&
                                company.address.location.lng !== undefined &&
                                company.address.location.lat !== null &&
                                company.address.location.lat !== undefined) {
                                self.getIcon(company)
                                    .subscribe(item => {
                                        debugger;
                                       let categoriesI: string = '';
                                        company.categories.map(category => {
                                            categories.map(r=>{
                                                if (r.id === category){
                                                    categoriesI+= r.name+', ';
                                                }
                                            });
                                        });
                                        company.category_string = categoriesI;
                                        self.companies.push(item);
                                    })
                            }
                            i++;
                        });
                    });
            })

    }

    getIcon(company: CompanyI): Observable<CompanyI> {
        return Observable.create((observer: Observer<CompanyI>) => {
            if (company.logo_hash) {
                this.service.getAvatar(`v1/company/${company.id}/logo`)
                    .subscribe(r => {
                        company.logo = r;
                        observer.next(company);
                    });
            }
            else{
                company.logo = 'assets/icon/Marker.png';
                observer.next(company);
            }

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
}
