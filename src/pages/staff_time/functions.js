import { format } from "date-fns";

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
