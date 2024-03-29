/**
 * Created by nardm on 24.11.16.
 */
/**
 * Created by nardm on 17.11.16.
 */
import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {count} from "rxjs/operator/count";
import {ConstService} from "../../const/http/service-const.service";
import {Category, CompanyI} from "../model/company";
import {Consts} from "../../const/app-const";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
@Injectable()
export class CompanyService {


  private companyServiceUrl = Consts.baseURL + 'v1/company';  // URL to web api
  private companyUrl = Consts.baseURL + 'manage/v1/company';  // URL to web api
  private comapnySearchUrl = Consts.baseURL + 'manage/v1/company/search?like=';
  public categoryID: number = undefined;

  constructor(private constService: ConstService) {
  }

  getCompanies(offset: number, count: number, cityID: number, categoryID: number, like: string) {
    let url: string;
    url = this.companyUrl + '?' +
        (like === '' ? '' : 'like=' + like) +
        (like === '' ? 'count=' + count : '&count=' + count ) +
        '&offset=' + offset +
        (categoryID === 0 ? '' : '&category_filter=' + categoryID) +
        (cityID === 0 ? '' : '&city_id=' + cityID);
    return this.constService.get<CompanyI[]>(url, 'companies');
  }

  getCategories(): Promise<CategoryI[]>{
    let url: string = `${Consts.baseURL}manage/v1/category`;
    return this.constService.get<CategoryI[]>(url, 'categories');
  }

  getCity(): Promise<Cities>{
    let url: string = `${Consts.baseURL}v1/city`;
    return this.constService.get<Cities>(url);
  }


}
export interface CategoryI {
  id: number;
  name: string;
  form_id: number;
  img?: string;
  key_words?: string[];
  from_color: string;
  subcategories: CategoryI[];
  subcategoriesBool: boolean;
  to_color: string;
  root: boolean;
  sequence: number;
  company: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface City {
  id: number;
  name: string;
  location: Location;
}

export interface Cities {
  cities: City[];
}