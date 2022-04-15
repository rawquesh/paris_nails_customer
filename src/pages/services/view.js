import { Checkbox, FormControlLabel } from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject, getArrayOfIDs } from "../../utils/functions";
import { NavBar } from "../home/components/header";
import styles from "./css/style.module.css";

export default function Services() {
  const [categories, setcategories] = useState([]);

  const [services, setServices] = useState([]);

  const [allServices, setAllServices] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Popular");

  useEffect(() => {
    fetchCategories();
    fetchServices();
    // eslint-disable-next-line
  }, []);

  async function fetchCategories() {
    const query = doc(db, "shop", "categories");

    try {
      const docRef = await getDoc(query);
      const cate = docRef.data().data;
      setcategories(["Popular", ...cate]);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchServices() {
    const snapshot = await getDocs(collection(db, "services"));
    const _fetched = snapshot.docs.map(documentDataToObject);
    setAllServices(_fetched);

    handleCategoryChange(selectedCategory, _fetched);
  }

  function handleCategoryChange(value, services) {
    if (value === "Popular") {
      const sortArray = [...services];
      sortArray.sort((a, b) => a.popular - b.popular).reverse();
      setServices(sortArray.slice(0, 10));
    } else {
      const filtered = services.filter((val) => val.categories.includes(value));
      setServices(filtered);
    }
    setSelectedCategory(value);
  }

  function handleServicesChange(event, e) {
    if (!event.target.checked) {
      setSelectedServices(selectedServices.filter((value) => value !== e));
    } else {
      setSelectedServices([...selectedServices, e]);
    }
  }

  return (
    <div>
      <NavBar />
      <Heading />

      <div className={styles.horiCategories}>
        <span className={styles.cateTextTop}>Categories : </span>
        <div className={styles.horiCategories2}>
          {categories.map((e) => (
            <FormControlLabel
              key={e}
              control={
                <Checkbox
                  onChange={(_) => {
                    handleCategoryChange(e, allServices);
                  }}
                  checked={selectedCategory === e}
                />
              }
              label={<p>{e}</p>}
            />
          ))}
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.sections}>
          <div className={`${styles.categories} ${styles.section}`}>
            <h3>categories</h3>
            <span className={styles.Divider} />
            <div className={styles.inner_section}>
              {categories.map((e) => (
                <FormControlLabel
                  key={e}
                  control={
                    <Checkbox
                      onChange={(_) => {
                        handleCategoryChange(e, allServices);
                      }}
                      checked={selectedCategory === e}
                    />
                  }
                  label={<p>{e}</p>}
                />
              ))}
            </div>
          </div>
          <div className={`${styles.services} ${styles.section}`}>
            <h3>Services</h3>
            <span className={styles.Divider} />
            <div className={styles.inner_section}>
              {services.map((e) => (
                <div key={e.id} className={styles.label}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(event) => {
                          handleServicesChange(event, e);
                        }}
                        checked={selectedServices
                          .map(getArrayOfIDs)
                          .includes(e.id)}
                      />
                    }
                    label={<p>{e.name}</p>}
                  />
                  <div className={styles.specs}>
                    <p>${e.price}</p>
                    <p>
                      <span>{e.duration}</span>min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.selected_services} ${styles.section}`}>
            <h3>Selected Services</h3>
            <span className={styles.Divider} />
            <div className={styles.inner_section}>
              {selectedServices.map((e) => (
                <div key={e.id} className={styles.label}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(event) => {
                          handleServicesChange(event, e);
                        }}
                        checked={selectedServices
                          .map(getArrayOfIDs)
                          .includes(e.id)}
                      />
                    }
                    label={<p>{e.name}</p>}
                  />
                  <div className={styles.specs}>
                    <p>${e.price}</p>
                    <p>
                      <span>{e.duration}</span>min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
