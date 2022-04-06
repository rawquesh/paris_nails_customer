import React from "react";
import styles from "./css/footer.module.css";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "@mui/material";

export default function Footer() {
  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <h3>About Us</h3>
        <span className={styles.divider}></span>
        <p>
          Paris Nail Salon has been offering an extensive range of nail services
          and skin treatments since 1999.
        </p>
      </div>
      <div className={styles.item}>
        <h3>Useful links</h3>
        <span className={styles.divider}></span>
        <div>
          <Link href="#" underline="hover">
            Account
          </Link>
        </div>
        <div>
          <Link href="#" underline="hover">
            Bookings
          </Link>
        </div>
        <div>
          <Link href="#" underline="hover">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className={styles.item}>
        <h3>Opening Hours</h3>
        <span className={styles.divider}></span>
        <p>
          Mon-Fri: 9 am - 6 pm <br /> Saturday: 9 am - 4 pm <br /> Sunday:
          Closed
        </p>
      </div>
      <div className={styles.item}>
        <h3>Contact Information</h3>
        <span className={styles.divider}></span>
        <div style={{ display: "flex" }}>
          <LocationOnIcon className={styles.icon} />
          <Link href="#" underline="hover">
            Shop 2/25 Fletcher Road Chirnside Park VIC 3116 Australia
          </Link>
        </div>
        <div>
          <LocalPhoneIcon className={styles.icon} />
          <Link href="#" underline="hover">
            (03) 9727 4322
          </Link>
        </div>
        <div>
          <EmailIcon className={styles.icon} />
          <Link href="#" underline="hover">
            info@parisnails.com.au
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
        <img src="images/logo.png" height={"65px"}  />
        <p>Copyright 2022 © Paris Nails. All Rights Reserved.</p>
        <span />
      </div>
    </div>
  );
}
