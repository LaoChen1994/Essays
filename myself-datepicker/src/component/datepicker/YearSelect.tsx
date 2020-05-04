import React, { ReactElement, useState, useMemo, useCallback } from "react";
import "./index.css";
import cx from "classnames";
import SelectBar from "./SelectBar";

interface Props {
  selectYear: number;
  onYearSelect?: (year: number) => void
}

const PAGE_SIZE = 9;

export default function YearSelect(props: Props): ReactElement {
  const { selectYear, onYearSelect } = props;
  const initYears = useMemo(() => {
    return Array.from({ length: PAGE_SIZE }).map(
      (_, index) => index - 4 + selectYear
    );
  }, [selectYear]);

  const [start, setStart] = useState<number>(0);
  const [yearMap, setYearMap] = useState<number[]>(initYears);

  const handlePrevClick = useCallback(() => {
    let _start = start - 1;
    if (_start < 0) {
      _start = 0;
      const currFirst = yearMap[0];
      const prevYearMap = Array.from({ length: PAGE_SIZE }).map(
        (_, index) => index - 9 + currFirst
      );
      setYearMap([...prevYearMap, ...yearMap]);
      return;
    }

    setStart(start - 9);
  }, [start, yearMap]);

  const handleNextClick =  useCallback(() => {
    const nextStart = start + PAGE_SIZE;
    if (nextStart >= yearMap.length) {
      const currEnd = yearMap[yearMap.length - 1];
      const nextYearMap = Array.from({ length: PAGE_SIZE }).map(
        (_, index) => index + 1 + currEnd
      );

      setYearMap([...yearMap, ...nextYearMap]);
    }

    setStart(nextStart);
  }, [start, yearMap])

  const handleYearSelect = (year: number) => () => {
    onYearSelect && onYearSelect(year)
  }


  return (
    <>
      <SelectBar
        title={`${yearMap[start]}-${yearMap[start + PAGE_SIZE - 1]}`}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
      <div className={cx({ "year-header": true })}>
        {yearMap.slice(start, start + PAGE_SIZE).map((item) => (
          <div
            className={cx({
              "year-block": true,
              isSelected: item === selectYear,
            })}
            onClick={handleYearSelect(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
