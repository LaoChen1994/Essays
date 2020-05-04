import React, {
  useMemo,
  useState,
  useImperativeHandle,
  RefObject,
} from "react";
import DateUtils from "../../utils";
import { IDateItem } from "./interface";
import cx from "classnames";
import "./index.css";
import moment from "moment";
import YearSelect from "./YearSelect";
import SelectBar from "./SelectBar";

interface Props {
  width?: number;
  height?: number;
  panelWith?: number;
  panelHeight?: number;
  onDatePick?: (year: number, month: number, day: number) => void;
  formatString?: string;
  dateRef?: DatePickerRef;
}

export type DatePickerRef = RefObject<{
  getDate: () => IDateItem;
}>;

const currDate = new DateUtils();

const DatePicker: React.FC<Props> = (props) => {
  const {
    panelWith = 400,
    panelHeight = 400,
    onDatePick,
    formatString = "YYYY-MM-DD",
    dateRef,
  } = props;
  const [year, setYear] = useState<number>(new Date().getFullYear());
  // month是从0起始的 需要+1
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectDay, setSelectDay] = useState<IDateItem>({
    month,
    day: new Date().getDate(),
    year,
  });

  const [isOnPanel, setIsOnPanel] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [isYearSelect, setYearSelect] = useState<boolean>(false);

  const formatDateValue = useMemo(() => {
    const { month, day, year } = selectDay;

    return moment(`${year}-${month}-${day}`).format(formatString);
  }, [selectDay, formatString]);

  const calendarMap = useMemo<IDateItem[]>(() => {
    return currDate.getDateMapInMonth(year, month);
  }, [year, month]);

  const onInputBlur = () => {
    if (!isOnPanel) {
      setShowTable(false);
    }
  };

  const handleYearChange = (year: number) => {
    setYear(year)
    setSelectDay({...selectDay, year})
    setYearSelect(false)
  }

  useImperativeHandle(
    dateRef,
    () => {
      return {
        getDate() {
          return selectDay;
        },
      };
    },
    [selectDay]
  );

  const handleSelectDay = (year: number, month: number, day: number) => (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectDay({ year, month, day });
    onDatePick && onDatePick(year, month, day);
    setShowTable(false);
  };

  const linkToMonth = (month: number) => () => {
    let _month = month;
    let _year = year;
    if (month <= 0) {
      console.log(month);
      _month = 12;
      _year--;
    } else if (month >= 12) {
      _month = 1;
      _year++;
    }
    setMonth(_month);
    setYear(_year);
  };

  return (
    <>
      <div className="datepicker">
        <div className="dateInput">
          <input
            type="text"
            className="input"
            onFocus={() => setShowTable(true)}
            onBlur={onInputBlur}
            value={formatDateValue}
            onChange={() => {}}
          />
          <i className="iconfont icon-rili input-icon"></i>
        </div>
        {showTable && (
          <div
            className="selectPanel"
            style={{ width: panelWith, height: panelHeight }}
            onMouseEnter={() => {
              setIsOnPanel(true);
            }}
            onMouseLeave={() => {
              setIsOnPanel(false);
            }}
          >
            {!isYearSelect && (
              <>
                <SelectBar
                  title={`${year} 年 ${!isYearSelect && `${month} 月`}`}
                  onPrevClick={linkToMonth(month - 1)}
                  onTitleClick={() => setYearSelect(true)}
                  onNextClick={linkToMonth(month + 1)}
                />
                <div className="weekContainer">
                  {["Mon", "Tues", "Wen", "Thur", "Fri", "Sat", "Sun"].map(
                    (item, index) => (
                      <div className="weekNots" key={`weeknotes-${index}`}>
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="dateContainer">
                  {calendarMap.map((item, index) => (
                    <div
                      className={cx({
                        datePanel: true,
                        isDisabled: month !== item.month,
                        isSelected:
                          selectDay.month === item.month &&
                          selectDay.day === item.day &&
                          selectDay.year === item.year,
                      })}
                      onClick={handleSelectDay(item.year, item.month, item.day)}
                      key={`datepanel-${index}`}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>
              </>
            )}
            {isYearSelect && <YearSelect selectYear={year} onYearSelect={handleYearChange} />}
          </div>
        )}
      </div>
    </>
  );
};

export default DatePicker;
