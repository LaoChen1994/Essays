import React, { ReactElement } from "react";
import './index.css'

interface Props {
  title: string;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onTitleClick?: () => void;
}

const defaultCallBack = () => {};

export default function SelectBar(props: Props): ReactElement {
  const {
    onPrevClick = defaultCallBack,
    onNextClick = defaultCallBack,
    title,
    onTitleClick = defaultCallBack,
  } = props;
  return (
    <div className='select-header'>
      <div
        className="iconfont arrow icon-left-arrow"
        onClick={onPrevClick}
      ></div>
      <div className="selectTime" onClick={onTitleClick}>
        {title}
      </div>
      <div
        className="iconfont arrow icon-right-arrow"
        onClick={onNextClick}
      ></div>
    </div>
  );
}
