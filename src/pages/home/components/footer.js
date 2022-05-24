import React from "react";
import styles from "./css/footer.module.css";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "@mui/material";
import {
  SHOP_ABOUT,
  SHOP_ADDRESS,
  SHOP_COPYRIGHT,
  SHOP_EMAIL,
  SHOP_PHONE,
  SHOP_TIME,
} from "../../../utils/const";

export default function Footer() {
  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <h3>About Us</h3>
        <span className={styles.divider}></span>
        <p>{SHOP_ABOUT}</p>
      </div>
      <div className={styles.item}>
        <h3>Useful links</h3>
        <span className={styles.divider}></span>
        <div>
          <Link href="/account" underline="hover">
            Account
          </Link>
        </div>
        <div>
          <Link href="/services" underline="hover">
            Services
          </Link>
        </div>
        <div>
          <Link href="/account" underline="hover">
            Bookings
          </Link>
        </div>
      </div>
      <div className={styles.item}>
        <h3>Opening Hours</h3>
        <span className={styles.divider}></span>
        {SHOP_TIME}
      </div>
      <div className={styles.item}>
        <h3>Contact Information</h3>
        <span className={styles.divider}></span>
        <div style={{ display: "flex" }}>
          <LocationOnIcon className={styles.icon} />
          <Link href="#" underline="hover">
            {SHOP_ADDRESS}
          </Link>
        </div>
        <div>
          <LocalPhoneIcon className={styles.icon} />
          <Link href="#" underline="hover">
            {SHOP_PHONE}
          </Link>
        </div>
        <div>
          <EmailIcon className={styles.icon} />
          <Link href="#" underline="hover">
            {SHOP_EMAIL}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Bottom() {
  return (
    <div className={styles.bottom}>
      <div>
        <img alt="logo" src="images/logo.png" height={"65px"} />
        <p>{SHOP_COPYRIGHT}</p>
        <span />
      </div>
    </div>
  );
}
