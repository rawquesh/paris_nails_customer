import {
  Button,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";

import {
  documentDataToObject,
  getArrayOfIDs,
} from "../../utils/functions/firestore";
import { randomInteger } from "../../utils/functions/math";
import { showToast } from "../../utils/functions/toast";

import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import styles from "./css/style.module.css";

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [categories, setcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Popular");

  const [tabCount, setTabCount] = useState(0);

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

  function handleTabChange(_, nevalue) {
    setTabCount(nevalue);
  }

  function handleNextButton() {
    if (selectedServices.length === 0) {
      return showToast({
        message: "Please select few services.",
        type: "warning",
      });
    }
    navigate(
      `/choose-staff-time?ids=${selectedServices.map(getArrayOfIDs).join("|")}`
    );
  }

  /// components

  function ServicesSection() {
    const heights = [];
    for (let index = 0; index < 10; index++) {
      heights.push(randomInteger(30, 50));
    }
    return (
      <div className={styles.inner_section}>
        {services.length !== 0
          ? services.map((e) => (
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
            ))
          : heights.map((e) => (
              <Skeleton key={e + randomInteger(1, 1000)} height={e} />
            ))}
      </div>
    );
  }

  function SelectedServicesSection() {
    return (
      <div className={styles.inner_section}>
        {selectedServices.length !== 0 ? (
          selectedServices.map((e) => (
            <div key={e.id} className={styles.label}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(event) => {
                      handleServicesChange(event, e);
                    }}
                    checked={selectedServices.map(getArrayOfIDs).includes(e.id)}
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
          ))
        ) : (
          <p style={{ textAlign: "center", margin: "auto" }}>
            Note: Please select few services
          </p>
        )}
      </div>
    );
  }

  function CategoriesSection() {
    const heights = [];
    for (let index = 0; index < 8; index++) {
      heights.push(randomInteger(30, 50));
    }
    return (
      <div className={styles.inner_section}>
        {categories.length !== 0
          ? categories.map((e) => (
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
            ))
          : heights.map((e) => (
              <Skeleton key={e + randomInteger(1, 1000)} height={e} />
            ))}
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Heading />

      <div className={styles.horiCategories}>
        <span className={styles.cateTextTop}>Categories : </span>
        <div className={styles.horiCategories2}>
          {categories.length !== 0 ? (
            categories.map((e) => (
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
            ))
          ) : (
            <>
              <Skeleton width={"100%"} height={20} />
              <Skeleton width={"100%"} height={20} />
              <Skeleton width={"100%"} height={20} />
            </>
          )}
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.main2}>
          <div className={styles.sections}>
            <div className={`${styles.categories} ${styles.section}`}>
              <h3>Categories</h3>
              <span className={styles.Divider} />
              <CategoriesSection />
            </div>
            <div className={`${styles.services} ${styles.section}`}>
              <h3>Services</h3>
              <span className={styles.Divider} />
              <ServicesSection />
            </div>
            <div className={`${styles.selected_services} ${styles.section}`}>
              <h3>Selected Services</h3>
              <span className={styles.Divider} />
              <SelectedServicesSection />
            </div>
          </div>
          <div className={styles.miniSections}>
            <Tabs
              value={tabCount}
              onChange={handleTabChange}
              aria-label="Services sections"
              sx={{ mb: 2, mt: 1 }}
            >
              <Tab label=" Services" {...a11yProps(0)} />
              <Tab label=" Selected Services" {...a11yProps(1)} />
            </Tabs>
            {tabCount === 0 ? <ServicesSection /> : <SelectedServicesSection />}
          </div>
        </div>
        <div className={styles.Button}>
          <Button onClick={handleNextButton} variant="contained">
            {"Choose Staff & Time >"}
          </Button>
        </div>
      </div>
      <Footer />
      <Bottom />
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
