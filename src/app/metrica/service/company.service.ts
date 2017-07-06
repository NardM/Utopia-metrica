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

@Injectable()
export class CompanyService {


  private companyServiceUrl = Consts.baseURL + 'v1/company';  // URL to web api
  private companyUrl = Consts.baseURL + 'manage/v1/company';  // URL to web api
  private comapnySearchUrl = Consts.baseURL + 'manage/v1/company/search?like=';
  public categoryID: number = undefined;

  constructor(private constService: ConstService) {
  }

  getCompanies(offset: number, count?: number) {
    let url: string;
    if (this.categoryID) {
      url = this.companyUrl + '?count=50&offset=' + offset + '&category_filter=' + this.categoryID;
    }
    else {
      url = this.companyUrl + '?count=50&offset=' + offset;
    }
    if (count){
      url = `${this.companyUrl}?count=${count}&offset=${offset}`;
    }
    return this.constService.get<CompanyI[]>(url, 'companies');
  }

  getCategories(): Promise<CategoryI[]>{
    let url: string = `${Consts.baseURL}manage/v1/category`;
    return this.constService.get<CategoryI[]>(url, 'categories');
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
