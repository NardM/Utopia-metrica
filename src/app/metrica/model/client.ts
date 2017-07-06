export declare module ClientInterface {

  export interface Account {
    id: number;
    avatar_hash: string;
    skin_id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    blocked: boolean;
    roles: string[];
  }

  export interface Client {
    accounts: Account[];
  }

}

