import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk';
import {MdPaginator} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {MdSort} from '@angular/material';
import {CompanyService} from "../service/company.service";
import {CompanyI} from "../model/company";

@Component({
    selector: 'companies-table',
    styleUrls: ['companies-table.component.scss'],
    templateUrl: 'companies-table.component.html',
})
export class TablePaginationExample {
    displayedColumns = ['userId', 'userName', 'progress', 'color'];
    exampleDatabase;
    dataSource: ExampleDataSource | null;

    @ViewChild(MdPaginator) paginator: MdPaginator;
    @ViewChild('filter') filter: ElementRef;


    private _categoryID: number = 0;
    private cityID: number = 0;
    public like: string = '';
    public companies: CompanyI[] = [];

    constructor(private companyService: CompanyService) {
        let self = this;
        self.companyService.getCompanies(0, 1000, self.cityID, self._categoryID, self.like)
            .then(res => {
                debugger;
                self.exampleDatabase = new ExampleDatabase(res);
                self.dataSource = new ExampleDataSource(self.exampleDatabase, self.paginator);
                Observable.fromEvent(self.filter.nativeElement, 'keyup')
                    .debounceTime(150)
                    .distinctUntilChanged()
                    .subscribe(() => {
                        if (!self.dataSource) {
                            return;
                        }
                        self.dataSource.filter = self.filter.nativeElement.value;
                    });
            });
    }

    ngOnInit() {

    }
}




/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<CompanyI[]> ;
    get data(): CompanyI[] { return this.dataChange.value; }

    constructor(private companies: CompanyI[]) {
        debugger;
        this.dataChange = new BehaviorSubject<CompanyI[]>(companies);
        companies.map(res=>{
            this.addUser(res);
        })
        // Fill up the database with 100 users.
    }



    /** Adds a new user to the database. */
    addUser(res: CompanyI) {
        const copiedData = this.data.slice();
        copiedData.push(res);
        this.dataChange.next(copiedData);
    }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(private _exampleDatabase: ExampleDatabase,
                private _paginator: MdPaginator) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<CompanyI[]> {
        debugger;
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._paginator.page,
            this._filterChange,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return this._exampleDatabase.data.slice(startIndex, this._paginator.pageSize)
                .filter((item: CompanyI) => {
                let searchStr = (item.company.name + item.master.first_name + item.master.last_name)
                    .toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) != -1;
            });
            // Grab the page's slice of data.
        });
    }

    disconnect() {
    }

}