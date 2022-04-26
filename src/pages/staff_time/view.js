import React, { useEffect, useState } from "react";

import {
  collection,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
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
import {
  Button,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { addDays, isAfter, isBefore, isDate } from "date-fns";

import styles from "./style.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import { randomInteger } from "../../utils/functions/math";
import { getDateAsString, PaymentStatus } from "./functions";

export default function ChooseStaffTime(props) {
  const navigate = useNavigate();
  const queryParam = useQuery();

  const idsFromParam = queryParam.get("ids").split("|");

  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [datePickerError, setDatePickerError] = React.useState(null);

  useEffect(() => {
    fetchServices();
    // fetchShopTimeline();
    // eslint-disable-next-line
  }, []);

  async function fetchServices() {
    if (idsFromParam.length > 10) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "services"),
      where(documentId(), "in", idsFromParam)
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setServices(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }
  async function fetchBookings() {
    const q = query(
      collection(db, "bookings"),
      where("status", "in", [
        PaymentStatus.approved,
        PaymentStatus.atShop,
        PaymentStatus.completed,
      ]),
      where("scheduled_date", "==", getDateAsString(selectedDate))
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setServices(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  async function fetchShopTimeline() {
    const q = query(
      collection(db, "timeline"),
      orderBy("date_created", "desc"),
      limit(1)
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject)[0];
      console.log(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  function handleChange(newValue) {
    setSelectedDate(newValue);

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

  function handlePreviousButton() {
    navigate(-1);
  }
  function handleNextButton() {}

  // Components ======================================================================

  function DatePickerSection() {
    return (
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
            value={selectedDate}
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
    );
  }

  function ServicesSection() {
    const heights = [];
    for (let index = 0; index < idsFromParam.length; index++) {
      heights.push(randomInteger(30, 50));
    }
    // return (
    //   <div className={styles.services}>
    //     {services.length !== 0
    //       ? services.map((e, i) => (
    //           <div key={e.id} className={styles.service}>
    //             <h4>
    //               {i + 1}. {e.name}, {e.price}$, {e.duration}min
    //             </h4>
    //           </div>
    //         ))
    //       : heights.map((e) => (
    //           <Skeleton key={e + randomInteger(1, 1000)} height={e} />
    //         ))}
    //   </div>
    // );

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                borderBottom: "1.4px solid var(--theme-color)",
                backgroundColor: "var(--theme-color)",
                "*": { fontFamily: "Montserrat", fontSize: "15.5px" },
              }}
            >
              <TableCell>Services</TableCell>
              <TableCell align="right">Staff And Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length !== 0
              ? services.map((service) => (
                  <TableRow
                    key={service.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "*": { fontFamily: "Montserrat" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {service.name}
                    </TableCell>
                    <TableCell align="right">
                      <Button style={{ fontSize: "12px" }} variant="outlined">
                        Choose
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : heights.map((e) => (
                  <TableRow key={e + randomInteger(1, 1000)}>
                    <TableCell>
                      <Skeleton width={"100%"} height={e} />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        width={"100%"}
                        key={e + randomInteger(1, 1000)}
                        height={e}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
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

  return (
    <>
      <NavBar />
      <Heading title="Choose a day & time" />
      <div className={styles.main}>
        <DatePickerSection />

        <Divider variant="middle" />
        <BuildTitle title="Choose staff and time" />
        <ServicesSection />
        <Divider variant="middle" />
        <div className={styles.Button}>
          <Button onClick={handlePreviousButton} variant="contained">
            {"< Previous"}
          </Button>
          <Button onClick={handleNextButton} variant="contained">
            {"Next >"}
          </Button>
        </div>
        <Divider variant="middle" />
      </div>

      <Footer />
      <Bottom />
    </>
  );
}
