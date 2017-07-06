export class EmptyAnswer {
  success :Boolean;
  message :ResponseDescription ;
  data: any;
  name: string;
};

export class Answer<T> {
  success :Boolean;
  data :T;
  message :ResponseDescription ;
};
export class ResponseDescription {
  code:number;
  message:String;
}
