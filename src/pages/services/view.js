import React, { useState } from "react";

import Heading from "../../components/heading";
import { NavBar } from "../home/components/header";
import styles from "./css/style.module.css";

export default function Services() {
  const [categories, setcategories] = useState([]);

  const [services, setServices] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);



  return (
    <div>
      <NavBar />
      <Heading />
      <div className={styles.main}>
        <div className={styles.sections}>
          <div className={`${styles.categories} ${styles.section}`}>
            <h3>categories</h3>
            <span className={styles.Divider} />
          </div>
          <div className={`${styles.services} ${styles.section}`}>
            <h3>Services</h3>
            <span className={styles.Divider} />
          </div>
          <div className={`${styles.selected_services} ${styles.section}`}>
            <h3>Selected Services</h3>
            <span className={styles.Divider} />
          </div>
        </div>
      </div>
    </div>
  );
}
