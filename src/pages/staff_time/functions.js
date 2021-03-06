import { format } from "date-fns";

import { formatInTimeZone } from "date-fns-tz";

export class PaymentStatus {
  static pending = "pending";
  static approved = "approved";
  static atShop = "atShop";
  static failed = "failed";
  static completed = "completed";
  static hold = "hold";
  static getAsMsg(st) {
    switch (st) {
      case this.approved:
        return "Paid & Approved";
      case this.atShop:
        return "Pay at shop";
      case this.failed:
        return "Payment failed";
      default:
        return st.capitalizeFirst;
    }
  }
}

export function getDateAsString(date) {
  return format(date, "Y/M/d");
}
export function getDateAsString2(date) {
  return format(date, "d-M-Y");
}

export function formatToAus(date) {
  let offset = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").split("+")[1];
  // console.log(offset);

  let f = formatInTimeZone(
    date,
    "Australia/Melbourne",
    `yyyy-MM-dd'T'HH:mm:ss.SSS'+${offset}'`
  );
  return new Date(f);
}
