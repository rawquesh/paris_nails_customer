import { format } from "date-fns";
import { generate } from "shortid";

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateKey(pre) {
  return `${pre}_${generate()}`;
}


export function getDateAsString(date) {
  return format(date, "Y/M/d");
};
