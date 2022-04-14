import { Checkbox, FormControlLabel, List } from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { MySnackbar } from "../../components/feedback";

import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject, getArrayOfIDs } from "../../utils/functions";
import { NavBar } from "../home/components/header";
import styles from "./css/style.module.css";

export default function Services() {
  let [categories, setcategories] = useState([]);

  let [selectedCategories, setSelectedcategories] = useState([]);

  let [services, setServices] = useState([]);
  let [selectedServices, setSelectedServices] = useState([]);
  // const [snackBar, setSnackBar] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  async function fetchCategories() {
    const query = doc(db, "shop", "categories");

    try {
      const docRef = await getDoc(query);
      setcategories(docRef.data().data);
      console.log(docRef.data().data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchServices() {
    const snapshot = await getDocs(collection(db, "services"));
    setServices(snapshot.docs.map(documentDataToObject));
    console.log(snapshot.docs.map(documentDataToObject));
  }

  return (
    <div>
      <NavBar />
      <Heading />
      <div className={styles.main}>
        <div className={styles.sections}>
          <div className={`${styles.categories} ${styles.section}`}>
            <h3>categories</h3>
            <span className={styles.Divider} />
            {categories.map((e) => (
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={e}
              />
            ))}
          </div>
          <div className={`${styles.services} ${styles.section}`}>
            <h3>Services</h3>
            <span className={styles.Divider} />
            <div className={styles.service}>
              {services.map((e) => (
                <FormControlLabel
                  key={e.id}
                  control={
                    <Checkbox
                      onChange={(event) => {
                        if (!event.target.checked) {
                          setSelectedServices(
                            selectedServices.filter((value) => value !== e)
                          );
                        } else {
                          setSelectedServices([...selectedServices, e]);
                        }
                      }}
                      checked={selectedServices
                        .map(getArrayOfIDs)
                        .includes(e.id)}
                    />
                  }
                  label={e.name}
                />
              ))}
            </div>
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
