/**
 * Created by nardm on 17.01.17.
 */


import { Injectable }    from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

export interface WorkTimeData{
  fromHouse: number;
  fromMinute: number;
  toHouse: number;
  toMinute: number;
  output?: boolean;
}

export interface WorkTime {
  Day: WorkTimeData;
  Saturday: WorkTimeData;
  Sunday: WorkTimeData;
  Break: WorkTimeData;
}




@Injectable()
export class RLEService {

  constructor() {
  }

  public static encode(chaine: string): string {
    if (chaine == null)
      return "";
    if (chaine.length == 1)return RLEService.encodeUnit(chaine);
    let prefix: string = "";
    let i: number = 0;
    do {
      prefix += chaine.charAt(i);
      i++;
    } while (i < chaine.length && chaine.charAt(i - 1) == chaine.charAt(i));
    if (i < chaine.length && chaine.charAt(i - 1) != chaine.charAt(i)) {
      return RLEService.encodeUnit(prefix) + RLEService.encode(chaine.substring(prefix.length));
    }

    return RLEService.encodeUnit(chaine);
  }

  static workTimeI: WorkTime = <WorkTime>{
    Day: <WorkTimeData>{},
    Saturday: <WorkTimeData>{},
    Sunday: <WorkTimeData>{},
    Break: <WorkTimeData>{},
  };

  public static decode(chaine: string) {
    RLEService.decodeWorkTime(chaine);
   /* switch (chaine.length) {
      case 48:
        RLEService.decodeWorkTime(chaine);
        break;
      case 96:
        break;
      case 144:
        break;
      case 336:
        break;
    }*/
  }

  public static decodeWorkTime(chaine: string): WorkTime {
    debugger;
    let chaineTemp: string[] = chaine.match(/(\D+\d+)/ig);
    let fromHouse: number;
    let toHouse: number;
    let fromMinute: number;
    let toMinute: number;
    let fromHouseBreak: number = 0;
    let toHouseBreak: number = 0;
    let fromMinuteBreak: number = 0;
    let toMinuteBreak: number = 0;
    let houseBreak: number = 0;
    let minuteBreak: number = 0;
    let fromC: boolean = false;
    let fromO: boolean = false;
    let fromB: boolean = false;
    chaineTemp.map(res => {
      let house = Number(res.match(/(\d+)/i)[0]);
      if (res[0] === 'c') {
        if (!fromC) {
          if (house % 2 == 1) {
            fromHouse = (house - 1) / 2;
            fromMinute = 30;
          }
          else {
            fromHouse = house / 2;
            fromMinute = 0;
          }
          fromC = true;
        }
      }
      else if (res[0] === 'o') {
        if (!fromO) {
          if (house % 2 != 0) {
            toHouse = (house - 1) / 2;
            toMinute = 30;
          }
          else {
            toHouse = house / 2;
            toMinute = 0;
          }
          fromO = true;
        }
        else {
          if (house % 2 != 0) {
            toHouse += (house - 1) / 2;
            toMinute += 30;
          }
          else {
            toHouse = house / 2;
            toMinute = 0;
          }
          toHouse += fromHouse + houseBreak;
          toMinute += fromMinute + minuteBreak;
        }
      } else if (res[0] === 'b') {
        if (house % 2 != 0) {
          houseBreak = (house - 1) / 2;
          minuteBreak = 30;
        }
        else {
          houseBreak = house / 2;
          minuteBreak = 0;
        }
        fromHouseBreak += fromHouse + toHouse;
        fromMinuteBreak += fromMinute + toMinute;
        toHouseBreak = fromHouseBreak + houseBreak;
        toMinuteBreak = fromMinuteBreak + minuteBreak;
      }
    });
    let workTimeI: WorkTime =
      <WorkTime>{
        Day: <WorkTimeData>{
          fromHouse: fromHouse,
          fromMinute: fromMinute,
          toHouse: toHouse,
          toMinute: toMinute,
          output: false,
        },
        Saturday: <WorkTimeData>{
          fromHouse: fromHouse,
          fromMinute: fromMinute,
          toHouse: toHouse,
          toMinute: toMinute,
          output: false,
        },
        Sunday: <WorkTimeData>{
          fromHouse: fromHouse,
          fromMinute: fromMinute,
          toHouse: toHouse,
          toMinute: toMinute,
          output: false,
        },
        Break: <WorkTimeData>{
          fromHouse: fromHouseBreak,
          fromMinute: fromMinuteBreak,
          toHouse: toHouseBreak,
          toMinute: toMinuteBreak,
          output: false,
        },
      };
    return workTimeI;
  }



  private static encodeUnit(chaine: string) {
    return "" + chaine.length + chaine.charAt(0);
  }


  public static minuteTemp(minute): number {
    return minute == 0 ? 0 : minute > 15 && minute < 44 ? 1 : minute > 30 ? 2 : 0;
  }

  public static timeOpen(step) {
    let time: string = '';
    for (let i = 0; i < step; i++)
      time += 'o'
    return time;
  }

  public static timeClose(step) {
    let time: string = '';
    for (let i = 0; i < step; i++)
      time += 'c'
    return time;
  }

  public static timeBreak(step) {
    let time: string = '';
    for (let i = 0; i < step; i++)
      time += 'b'
    return time;
  }


  //с обедом

  private static lunchSchedule(onFromHouse: number, onFromMinute: number, onToHouse: number, onToMinute: number,
                               onFromHouseBreak: number, onFromMinuteBreak: number, onToHouseBreak: number, onToMinuteBreak: number,) {
    let time: string = "";
    let fromMinuteTemp: number = RLEService.minuteTemp(onFromMinute);
    let step: number = onFromHouse * 2 + fromMinuteTemp;
    time += RLEService.timeClose(step);
    // до обеда
    let fromMinuteBreakTemp: number = RLEService.minuteTemp(onFromMinuteBreak);
    step = (onFromHouseBreak - onFromHouse) * 2 - (fromMinuteTemp - fromMinuteBreakTemp);
    time += RLEService.timeOpen(step);
    //Обед
    let toMinuteBreakTemp: number = RLEService.minuteTemp(onToMinuteBreak);
    step = (onToHouseBreak - onFromHouseBreak) * 2 + (toMinuteBreakTemp - fromMinuteBreakTemp);
    time += RLEService.timeBreak(step);
    //после обеда
    let toMinuteTemp: number = RLEService.minuteTemp(onToMinute);
    step = (onToHouse - onToHouseBreak) * 2 + (toMinuteTemp - toMinuteBreakTemp);
    time += RLEService.timeOpen(step);
    //закрытие
    step = 48 - time.length;
    time += RLEService.timeClose(step);
    return time;
  }

  // без обеда
  private static scheduleWithoutLunch(onFromHouse: number, onFromMinute: number, onToHouse: number, onToMinute: number) {
    let time: string = "";
    let fromMinuteTemp: number = RLEService.minuteTemp(onFromMinute);
    let step: number = onFromHouse * 2 + fromMinuteTemp;
    time += RLEService.timeClose(step);
    let toMinuteTemp: number = RLEService.minuteTemp(onToMinute);
    step = (onToHouse - onFromHouse) * 2 + (toMinuteTemp - fromMinuteTemp);
    time += RLEService.timeOpen(step);
    time += RLEService.timeClose(48 - time.length);
    return time;
  }

  /*
   fullTime - круглосуточно
   notBreak - без обеда
   notFun - без выходных
   fun - суб-вс выходные
   */
  public static workTime(fromHouse: number, toHouse: number,
                         fromMinute: number, toMinute: number,
                         fullTime: boolean, notBreak: boolean,
                         fromHouseBreak?: number, toHouseBreak?: number,
                         fromMinuteBreak?: number, toMinuteBreak?: number,
                         fromHouseSaturday?: number, toHouseSaturday?: number,
                         fromMinuteSaturday?: number, toMinuteSaturday?: number,
                         fromHouseSunday?: number, toHouseSunday?: number,
                         fromMinuteSunday?: number, toMinuteSunday?: number,
                         outputMonday?: boolean,
                         outputTuesday?: boolean, outputWednesday?: boolean,
                         outputThursday?: boolean, outputFriday?: boolean,
                         outputSaturday?: boolean, outputSunday?: boolean,
                         saturdaySpecial?: boolean, sundaySpecial?: boolean): string {
    let notFun: boolean = !outputMonday && !outputTuesday && !outputWednesday && !outputThursday
      && !outputFriday && !outputSaturday && !outputSunday;
    let fun: boolean = !outputMonday && !outputTuesday && !outputWednesday && !outputThursday && !outputFriday && outputSaturday && outputSunday;

    let time: string = "";
    if (fullTime)
      return time = 'o48';
    else {

      let dayA: Array<boolean> = [outputMonday, outputTuesday, outputWednesday, outputThursday, outputFriday, outputSaturday, outputSunday];


      //все дни работают
      if (!dayA[0] && !dayA[1] && !dayA[2] && !dayA[3] && !dayA[4] && !dayA[5] && !dayA[6] && !sundaySpecial && !saturdaySpecial) {
        time = notBreak ? RLEService.scheduleWithoutLunch(fromHouse, fromMinute, toHouse, toMinute) :
          RLEService.lunchSchedule(fromHouse, fromMinute, toHouse, toMinute, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        return RLEService.encode(time);
      }

      //пн-пт
      if (!dayA[0] && !dayA[1] && !dayA[2] && !dayA[3] && !dayA[4] && dayA[5] && dayA[6]) {
        time = notBreak ? RLEService.scheduleWithoutLunch(fromHouse, fromMinute, toHouse, toMinute) :
          RLEService.lunchSchedule(fromHouse, fromMinute, toHouse, toMinute, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        time += RLEService.timeClose(48 * 2);
        return RLEService.encode(time);
      }


      //пн-сб, воскр выходной или особо работают
      if (!dayA[0] && !dayA[1] && !dayA[2] && !dayA[3] && !dayA[4] && !(!dayA[5] || saturdaySpecial) && !(dayA[6] || sundaySpecial)) {
        time = notBreak ? RLEService.scheduleWithoutLunch(fromHouse, fromMinute, toHouse, toMinute) :
          RLEService.lunchSchedule(fromHouse, fromMinute, toHouse, toMinute, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        if (saturdaySpecial)
          time += notBreak ? RLEService.scheduleWithoutLunch(fromHouseSaturday, fromMinuteSaturday, toHouseSaturday, toMinuteSaturday) :
            RLEService.lunchSchedule(fromHouseSaturday, fromMinuteSaturday, toHouseSaturday, toMinuteSaturday, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        if (sundaySpecial)
          time += notBreak ? RLEService.scheduleWithoutLunch(fromHouseSunday, fromMinuteSunday, toHouseSunday, toMinuteSunday) :
            RLEService.lunchSchedule(fromHouseSunday, fromMinuteSunday, toHouseSunday, toMinuteSunday, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        time += RLEService.timeClose(48);
        return RLEService.encode(time);
      }

      //пн-пт, сб обычный или рабочий, вс выходной или особый
      if (!dayA[0] && !dayA[1] && !dayA[2] && !dayA[3] && !dayA[4] && !(!dayA[5] || saturdaySpecial) && !(dayA[6]) || sundaySpecial) {
        time = notBreak ? RLEService.scheduleWithoutLunch(fromHouse, fromMinute, toHouse, toMinute) :
          RLEService.lunchSchedule(fromHouse, fromMinute, toHouse, toMinute, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        if (saturdaySpecial)
          time += notBreak ? RLEService.scheduleWithoutLunch(fromHouseSaturday, fromMinuteSaturday, toHouseSaturday, toMinuteSaturday) :
            RLEService.lunchSchedule(fromHouseSaturday, fromMinuteSaturday, toHouseSaturday, toMinuteSaturday, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        if (sundaySpecial)
          time += notBreak ? RLEService.scheduleWithoutLunch(fromHouseSunday, fromMinuteSunday, toHouseSunday, toMinuteSunday) :
            RLEService.lunchSchedule(fromHouseSunday, fromMinuteSunday, toHouseSunday, toMinuteSunday, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
        if (dayA[6]) time += RLEService.timeClose(48);
        return RLEService.encode(time);
      }

      //все дни
      for (let i = 0; i < 6; i++) {
        time += dayA[i] ? RLEService.timeClose(48) : notBreak ? RLEService.scheduleWithoutLunch(
              i == 5 && saturdaySpecial ? fromHouseSaturday : i == 6 && sundaySpecial ? fromHouseSunday : fromHouse,
              i == 5 && saturdaySpecial ? fromMinuteSaturday : i == 6 && sundaySpecial ? fromMinuteSunday : fromMinute,
              i == 5 && saturdaySpecial ? toHouseSaturday : i == 6 && sundaySpecial ? toHouseSunday : toHouse,
              i == 5 && saturdaySpecial ? toMinuteSaturday : i == 6 && sundaySpecial ? toMinuteSunday : toMinute) :
            RLEService.lunchSchedule(fromHouse, fromMinute, toHouse, toMinute, fromHouseBreak, fromMinuteBreak, toHouseBreak, toMinuteBreak);
      }

      debugger;
      return RLEService.encode(time);
    }
  }
}



