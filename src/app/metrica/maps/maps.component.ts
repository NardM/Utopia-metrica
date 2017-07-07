import {Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {LatLngBoundsLiteral, LatLngLiteral} from "angular2-google-maps/core";
import {RequestInterface} from "../../models/Request";
import {MD_DIALOG_DATA, MdDialogRef, MdSidenav} from "@angular/material";
import {Category, Companies, CompanyI} from "../model/company";
import {CategoryI, City, CompanyService} from "../service/company.service";
import {ConstService} from "../../const/http/service-const.service";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {FormControl} from "@angular/forms";
declare var google:any;

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {BaThemeSpinner} from "../../service/baThemeSpinner.service";


@Component({
    selector: 'business-maps',
    templateUrl: 'maps.component.html',
    styleUrls: ['maps.component.scss'],
})




export class BusinessMapsComponent implements OnInit {
    get categoryID(): number {
        return this._categoryID;
    }
    set categoryID(value: number) {
        this._categoryID = value;
        this.sidenav.close();
        this.getCompanies()
    }


    public latitude: number;
    public longitude: number;
    public zoom: number;
    public companies: CompanyI[] = [];
    public companiesBack: CompanyI[] = [];
    private categories: Array<{ name: string, id: number }> = [];
    protected cities: City[]= [];
    public stateCtrl: FormControl;
    public filteredStates: Observable<City[]>;
    private _categoryID: number = 0;
    private cityID: number = 0;
    public like: string = '';
    @ViewChild ('sidenav')
    sidenav: MdSidenav;
    public defaultCity: City;
    private date: Date;

    constructor(private companyService: CompanyService,
                private _state: BaThemeSpinner,
                private service: ConstService) {
        this.date = new Date();
        this.defaultCity = <City>{
            name: 'Все города',
            id: 0
        };
        this.stateCtrl = new FormControl();
            this.filteredStates = this.stateCtrl.valueChanges
                .startWith(null)
                .map(user => user && typeof user === 'object' ? user.name : user)
                .map(name => name ? this.filter(name) : this.cities.slice());
    }
    public filter(name: string): City[] {
        return this.cities.filter(option => new RegExp(`^${name}`, 'gi').test(option.name));
    }

    public displayFn(city: City): string| City {
        let self = this;
        if (city !== null) {
            self.cityID = city.id;
        }
        return city ? city.name : city;
    }

    public onCity(event, city: City){
        debugger;
        this.cityID = city.id;
        this.sidenav.close();
        this.getCompanies();
    }

    protected onLikeName(name: string): void {
        if (name === '' || name == null) {
            return;
        }
        this.like = name;
        this.getCompanies();
    }

    public getCompanies(): void {
        let self = this;

        self._state.showManager();
        self._state.hideGeneric('main');
        self.companies = [];
        self.companyService.getCompanies(0, 300, self.cityID===undefined?0:self.cityID,
            self.categoryID===undefined?0:self.categoryID, self.like)
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
                        let categoriesI: string = '';
                        company.categories.map(category => {
                            self.categories.map(r => {
                                if (r.id === category) {
                                    categoriesI += r.name + ', ';
                                }
                            });
                        });
                        company.category_string = categoriesI;
                        self.companies.push(company);
                    }
                    i++;
                });
                self._state.hideManager();
                self._state.showGeneric('main');
                self.companiesBack = self.companies;
            });
    }




    ngOnInit() {
        //set google maps defaults
        this.zoom = 12;
        let self = this;
        self.latitude = 55.7993562;
        self.longitude = 49.1059988;
        self.setCurrentPosition();
        let categories: Array<{ name: string, id: number }> = [{name: 'Все категории', id: 0}];
        self.companyService.getCategories()
            .then((res: CategoryI[]) => {
                res.map(category => {
                    if (category.subcategories.length === 0) {
                        categories.push({name: category.name, id: category.id});
                    }
                    else {
                        categories.push({name: category.name, id: category.id});
                        category.subcategories.map(item => {
                            categories.push({name: item.name, id: item.id});
                        })
                    }
                });
                self.categories = categories;
            })
            .then(() => {
                self.companyService.getCity()
                    .then(res => {
                        self.cities = res.cities;
                    })
            })
            .then(() => {
                self.getCompanies();
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

    public onDateCompanyPicker(event) {
        let self = this;
        debugger;
        self.companies = [];
        let date = new Date(event);
        let dateNumber: number;
        date.setHours(0, 0);
        dateNumber = date.getTime();
        let dateNumber2: number = date.getTime() + 86400000;
        self.companiesBack.map(company => {
            if (company.date > dateNumber && company.date < dateNumber2) {
                debugger;
                self.companies.push(company);
            }
        });

        debugger;

    }

    public onDateCompany(event: string) {
        let self = this;
        self.companies = [];
        let date: Date = new Date();
        let dateNumber: number;
        switch (event) {
            case '1':
                date.setHours(0, 0);
                dateNumber = date.getTime() - 86400000;
                let dateNumber2: number = date.getTime();
                self.companiesBack.map(company => {
                    if (company.date > dateNumber && dateNumber2 > company.date) {
                        self.companies.push(company);
                    }
                });
                break;
            case '2':
                date.setHours(0, 0);
                dateNumber = date.getTime();
                self.companiesBack.map(company => {
                    if (company.date > dateNumber) {
                        self.companies.push(company);
                    }
                });
                break;
            case '3':
                break;
            case '4':
                break;
            case '5':
                break;
            case '6':
                break;
        }
        debugger;
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
