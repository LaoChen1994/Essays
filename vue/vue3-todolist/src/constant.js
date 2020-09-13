import moment from "moment";

export const todoListMock = [
  {
    id: 1,
    title: "事件1",
    target: "目标1",
    startTime: moment().format("YYYY-MM-DD"),
    endTime: moment()
      .add(1, "days")
      .format("YYYY-MM-DD"),
    isFinished: false,
  },
  {
    id: 2,
    title: "事件2",
    target: "目标2",
    startTime: moment().format("YYYY-MM-DD"),
    endTime: moment()
      .add(2, "days")
      .format("YYYY-MM-DD"),
    isFinished: false,
  },
  {
    id: 3,
    title: "事件3",
    target: "目标3",
    startTime: moment().format("YYYY-MM-DD"),
    endTime: moment()
      .add(3, "days")
      .format("YYYY-MM-DD"),
    isFinished: false,
  },
  {
    id: 4,
    title: "事件4",
    target: "目标4",
    startTime: moment().format("YYYY-MM-DD"),
    endTime: moment()
      .add(4, "days")
      .format("YYYY-MM-DD"),
    isFinished: false,
  },
  {
    id: 5,
    title: "事件5",
    target: "目标5",
    startTime: moment().format("YYYY-MM-DD"),
    endTime: moment()
      .add(5, "days")
      .format("YYYY-MM-DD"),
    isFinished: false,
  },
];
