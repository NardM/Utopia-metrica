import {Injectable} from '@angular/core';

@Injectable()
export class BaThemeSpinner {

  private _selector:string = 'loading-wrapper';
  private _selectorManager:string = 'preolader';

  private _element:HTMLElement;
  private _elementManager:HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector);
    this._elementManager = document.getElementById(this._selectorManager);
  }

  public show():void {
    this._element.style['display'] = 'block';
  }

  public showManager():void {
    this._element.style['display'] = 'block';
  }

  public hide(delay:number = 0):void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }

  public hideManager(delay:number = 0):void {
    this._elementManager = document.getElementById(this._selectorManager);
      this._elementManager.style['display'] = 'none';
  }
}
