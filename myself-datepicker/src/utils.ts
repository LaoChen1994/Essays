import { IDateItem } from "./component/datepicker/interface";

export default class DateUtils {
  constructor() {}

  private getWeek(week: number) {
    return week ? week : 7;
  }

  private getDateInfoInMonth(year: number, month: number) {
    // 6月份对应的month是5
    month -= 1;
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(1);

    const { day, week: firstWeek, ...res } = this.getDateInfoByString(
      date.toDateString()
    );

    const lastWeek = this.getWeek(this.getLastDayInMonth(year, month).getDay());

    return {
      lastWeek,
      firstWeek,
      ...res,
    };
  }

  private getLastDayInMonth(year: number, month: number) {
    const date = new Date();
    date.setMonth(month + 1);
    date.setDate(0);

    return date;
  }

  /**
   * 获取当前月份信息
   * 返回值[year, month, day, week,totalDay]
   *  month: 6月返回的就是6
   *  week: 周日为7
   */
  public getDateInfoByString(specDate?: string | number) {
    const date = specDate ? new Date(specDate) : new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const week = this.getWeek(date.getDay());

    // 获取本月总天数的方法就是
    // 拿到本月最后一天的日期，日期是几号，本月就有几天
    const totalDay = this.getLastDayInMonth(year, month).getDate();

    return {
      year,
      month: month + 1,
      day,
      week,
      totalDay,
    };
  }

  /**
   * getDateMapInMonth
   * year: 当前的年份
   * month: 当前的月份 6月就是6
   */
  public getDateMapInMonth(year: number, month: number) {
    const { firstWeek, lastWeek, totalDay } = this.getDateInfoInMonth(
      year,
      month
    );

    month -= 1
    const max_num = 42;

    const prevTailDay = firstWeek - 1;
    let nextHeadDay = 7 - lastWeek;

    const compensateInTail = max_num - totalDay - prevTailDay - nextHeadDay;

    nextHeadDay += compensateInTail;

    // 获取上个月的最后一天
    const lastMonthDay = this.getLastDayInMonth(year, month - 1).getDate();

    const prevDayList: IDateItem[] = Array.from({ length: prevTailDay }).map(
      (_, index) => {
        return {
          month,
          day: lastMonthDay - index,
          year
        };
      }
    );

    const currMonthList: IDateItem[] = Array.from({length: totalDay}).map((_, index) => {
        return {
            month: month + 1,
            day: index + 1,
            year
        }
    });

    const nextMonthList: IDateItem[] = Array.from({length: nextHeadDay}).map((_, index) => {
        return {
            month: month + 2,
            day: index + 1,
            year
        }
    })

    return [...prevDayList, ... currMonthList, ...nextMonthList]
  }
}
