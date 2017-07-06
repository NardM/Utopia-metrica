/**
 * Created by nardm on 24.11.16.
 */
/**
 * Created by nardm on 17.11.16.
 */
import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { Consts } from '../../../const/app-const'
import {count} from "rxjs/operator/count";
import {ConstService} from "../../const/http/service-const.service";
import {Category, CompanyI} from "../model/company";

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

  getCompanyID(id: number | string) {
    let url = this.companyUrl + '/'+id;
    return this.constService.get<CompanyI>(url);
  }

  postCompanyCategory(companyId: number, categoryId) {
    let url = this.companyUrl + '/' + companyId + '/category/' + categoryId;
    return this.constService.postSingle(url);
  }

  getCompanyCategory(companyId: number) {
    let url = this.companyUrl + '/' + companyId + '/category';
    return this.constService.get<Category[]>(url, 'categories');
  }

  search(term: string){
    let url =this.comapnySearchUrl+term;
    return this.constService.search<CompanyI>(url, 'companies');
  }

  deleteCompany(companyId: number) {
    let url = this.companyUrl + '/' + companyId;
    return this.constService.delete(url);
  }

  putCompany(company: CompanyI) {
    let url = this.companyUrl + '/' + company.id;
    return this.constService.put<CompanyI>(url, company);
  }



}
