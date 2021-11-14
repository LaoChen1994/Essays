import React from "react";

interface Props {}

export const Button: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};
