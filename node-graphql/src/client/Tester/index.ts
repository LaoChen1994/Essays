import { omit } from "lodash";

const obj = { a: 1, b: 2 };
omit(obj, "a");

const c = 3;
console.log(c);
