/**
 * Created by nardm on 02.01.17.
 */
  export interface Category {
    id: number;
    name: string;
    key_words: string[];
    from_color: string;
    to_color: string;
    root: boolean;
    sequence: number;
  }

  export interface Location {
    lat: number;
    lng: number;
  }

  export interface Address {
    text: string;
    city_id: number;
    location: Location;
    admin: string;
    locality: string;
    thoroughfare: string;
    country_name: string;
    feature: string;
  }

  export interface Master {
    first_name: string;
    last_name: string;
  }

  export interface Company2 {
    name: string;
    inn: string;
  }

  export interface    CompanyI {
    role: number;
    date: number;
    balance: number;
    categories: number[];
    search_region_id: number;
    category_string?: string;
    id: number;
    logo_hash: string;
    order_count: number;
    order_price_summ: number;
    paid_percent_summ: number;
    freeze_percent_summ: number;
    banlance_transactions_summ: number;
    rate: number;
    phone: string;
    email: string;
    work_time: string;
    work_schedule: WorkSchedule;
    work_time_string?: string;
    work_time_break_string?: string;
    logo: string;
    skin_id: number;
    address: Address;
    master: Master;
    company: Company2;
  }

  export interface Companies {
    companies: CompanyI[];
  }

export interface SearchRegion {
  company_id: number;
  search_region_id: number;
}



  export interface WorkTimeI {
    from_hour: number;
    from_minute: number;
    to_hour: number;
    to_minute: number;
  }

  export interface Break {
    from_hour: number;
    from_minute: number;
    to_hour: number;
    to_minute: number;
  }

  export interface WorkTimes {
    round_clock: boolean;
    work_time: WorkTimeI;
    break: Break;
    special: boolean;
    holyday: boolean;
    days: number[];
  }

  export interface WorkSchedule {
    work_times: WorkTimes[];
  }


