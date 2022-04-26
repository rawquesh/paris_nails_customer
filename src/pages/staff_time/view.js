import React, { useEffect, useState } from "react";

import { collection, documentId, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject } from "../../utils/functions/firestore";
import { showToast } from "../../utils/functions/toast";
import useQuery from "../../utils/functions/use_query";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Divider, TextField } from "@mui/material";
import { addDays, isAfter, isBefore, isDate, subDays } from "date-fns";

import styles from "./style.module.css";
import {
  DatePicker,
} from "@mui/x-date-pickers";

export default function ChooseStaffTime() {
  const navigate = useNavigate();
  const query = useQuery();

  const [services, setServices] = useState([]);
  const [date, setDate] = React.useState(new Date());
  const [datePickerError, setDatePickerError] = React.useState(null);

  useEffect(() => {
    // fetchServices();
  }, []);

  async function fetchServices() {
    let ids = query.get("ids").split("|");

    if (ids.length > 10) {
      navigate("/");
      return;
    }

    const q = query(collection(db, "services"), where(documentId(), "in", ids));

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setServices(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  function handleChange(newValue) {
    setDate(newValue);


    if (isDate(newValue)) {
      let now = new Date();
      let later = addDays(now, 16);
      let newDate = newValue;

      newDate.setHours(23, 59, 59, 59);

      const validate = isAfter(newDate, now) && isBefore(newDate, later);

      if (validate) {
        console.log("correct date is ", newDate);
      }
    }
  }

  return (
    <>
      <NavBar />
      <Heading title="Choose a day & time" />
      <div className={styles.main}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <BuildTitle title="Choose a day" />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              minDate={new Date()}
              maxDate={addDays(new Date(), 15)}
              label="Pick a date"
              inputFormat="MM/dd/yyyy"
              value={date}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={datePickerError}
                  error={datePickerError !== null}
                  size="small"
                />
              )}
              onError={(r, v) => {
                let error = null;
                if (r === "maxDate") {
                  error = "Date should be under 15 days from now";
                } else if (r === "minDate") {
                  error = "You can not pick older dates.";
                } else if (r === "invalidDate") {
                  error = "Pick a vaild date.";
                } else if (typeof r === String) {
                  error = r;
                }
                setDatePickerError(error);
              }}
              pro
            />
          </LocalizationProvider>
        </div>
        <Divider variant="middle"  />
        <BuildTitle title="Choose your staff" />
      </div>

      <Footer />
      <Bottom />
    </>
  );
}

function BuildTitle({ title, widget }) {
  return (
    <div style={{ marginRight: "10px", marginBottom: "10px" }}>
      <h3 className={styles.midHeading}>{title}</h3>
      {widget}
    </div>
  );
}
