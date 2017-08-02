/**
 * Created by nardm on 08.12.16.
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {RequestMetricHub} from "../service/hubs/RequestHub";
import {MetricaStore} from "./maps/maps.store";

@Component({
  /*templateUrl: 'manage.component.html',
   styleUrls: ['manage.component.scss']*/
  template: `
      <div>
        <top-bar style="    position: fixed;
    display: block;
    width: 100%;
    min-height: 50px;"></top-bar>
        <main STYLE="position: fixed;
    display: block;
    width: 100%;
    margin-top: 60px;"> 
            <left-bar>
                <router-outlet></router-outlet>
            </left-bar>
        </main>
      </div>
     `,
  styles: [`::-webkit-scrollbar {
      width: 5px;
      height: 5px;
  }

  ::-webkit-scrollbar-button {
      width: 14px;
      height: 14px;
  }
  ::-webkit-scrollbar-thumb {
      background: #e1e1e1;
      border: 21px none #ffffff;
      border-radius: 50px;
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #ffffff;
  }
  ::-webkit-scrollbar-thumb:active {
      background: #ffffff;
  }
  ::-webkit-scrollbar-track {
      background: #727272;
      border: 19px none #ffffff;
      border-radius: 67px;
  }
  ::-webkit-scrollbar-track:hover {
      background: #727272;
  }
  ::-webkit-scrollbar-track:active {
      background: #727272;
  }
  ::-webkit-scrollbar-corner {
      background: transparent;
  }`]

})
export class UserComponent {
    constructor(private hub: RequestMetricHub,
                private cdRef:ChangeDetectorRef,
                private store: MetricaStore) {
        this.hub.newCompany
            .subscribe(res => {
                debugger;
                this.store.Added(res);
                this.cdRef.detectChanges();
                this.audioNotification();
            });
    }
    private audioNotification(): void {
        let audio = new Audio(); // Создаём новый элемент Audio
        audio.src = 'assets/audio/new.mp3'; // Указываем путь к звуку "клика"
        audio.autoplay = true; // Автоматически запускаем
    }
}
