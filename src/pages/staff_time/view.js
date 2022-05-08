import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isDate,
  isSameDay,
} from "date-fns";

import styles from "./style.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import { getDateAsString, PaymentStatus } from "./functions";
import MyDateDialog from "./dialog";
import { compact, findIndex, unset } from "lodash";
import { useUserAuth } from "../../utils/context/auth_context";

export default function ChooseStaffTime() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserAuth();

  const [services, setServices] = useState(location?.state?.services);
  const [shopTimeLine, setShopTimeLine] = useState();
  const [offDays, setOffDays] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerError, setDatePickerError] = useState(null);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceForDialog, setServiceForDialog] = useState();

  useEffect(() => {
    fetchShopTimeline();
    fetchBookings(selectedDate);
    fetchShopWorker();
    fetchOffDays();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Fetch Requests =======================================================

  async function fetchUserData() {
    if (user === "loading") return;
    try {
      const token = await user?.getIdToken(true);
      const res = await fetch(
        `https://australia-southeast1-possystem-db408.cloudfunctions.net/user?token=${token}`
      );
      if (res.status === 200) {
        const user = await res.json();
        setProfile(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchBookings(date) {
    setIsBookingsLoading(true);
    const q = query(
      collection(db, "bookings"),
      where("status", "in", [
        PaymentStatus.approved,
        PaymentStatus.atShop,
        PaymentStatus.completed,
      ]),
      where("scheduled_date", "==", getDateAsString(date))
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setBookings(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
    setIsBookingsLoading(false);
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
      setShopTimeLine(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  async function fetchShopWorker() {
    const q = query(collection(db, "workers"), orderBy("date_joined", "desc"));

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setWorkers(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }
  async function fetchOffDays() {
    const query = doc(db, "shop", "offday");

    try {
      const snapshot = await getDoc(query);
      const _fetched = snapshot.data().day;
      setOffDays(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  //  Functions ====================================================================

  function handleChange(newValue) {
    setSelectedDate(newValue);
    if (isDate(newValue)) {
      if (isSameDay(selectedDate, newValue)) {
        return;
      }
      let now = new Date();
      let later = addDays(now, 16);
      let newDate = newValue;

      newDate.setHours(23, 59, 59, 59);

      const validate = isAfter(newDate, now) && isBefore(newDate, later);

      setServices((e) => {
        let newArray = [];

        for (const obj of e) {
          let o = { ...obj };
          unset(o, "selected_date");
          unset(o, "selected_worker");
          newArray.push(o);
        }

        return newArray;
      });

      if (validate) {
        fetchBookings(newDate);
      }
    }
  }

  function handlePreviousButton() {
    navigate(-1);
  }
  function handleNextButton() {
    const isValidate =
      services.filter((e) => !e?.selected_date && !e?.selected_worker)
        .length === 0;
    if (!isValidate) {
      return showToast({
        type: "error",
        message: "Please pick dates for selected services.",
      });
    }
    let _user;
    if (profile) {
      _user = {};
      Object.keys(profile).forEach((key) => {
        if (profile[key] === "unset") {
          _user[key] = "";
        } else {
          _user[key] = profile[key];
        }
      });
    }

    navigate("/checkout", { state: { services: services, user: _user } });
  }

  function handleDialogOpen(_service) {
    // serviceForDialog = _service;
    setServiceForDialog(_service);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleDialogSave(selectedDate, service) {
    setServices((prevState) => {
      let state = [...prevState];
      const i = findIndex(state, service);
      if (i === -1) return showToast({ message: "something went wrong." });
      let s = {
        ...service,
        selected_date: selectedDate.date,
        selected_worker: selectedDate.worker,
      };

      state[i] = s;
      return state;
    });

    setDialogOpen(false);
  }

  let canDialogOpen =
    isBookingsLoading ||
    shopTimeLine === undefined ||
    workers.length === 0 ||
    services.length === 0;

  // Components ======================================================================

  if (!services) {
    return <Navigate to="/services" />;
  }

  function ServicesSection() {
    return (
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "15.5px",
                borderBottom: "1.4px solid var(--theme-color)",
                backgroundColor: "var(--theme-color)",
              }}
            >
              <TableCell
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "15.5px",
                }}
              >
                Services
              </TableCell>
              <TableCell
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "15.5px",
                }}
                align="right"
              >
                Staff And Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
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
                  {!service?.selected_date ? (
                    <Button
                      style={{ fontSize: "12px" }}
                      variant="outlined"
                      disabled={canDialogOpen}
                      onClick={() => {
                        handleDialogOpen(service);
                      }}
                    >
                      Choose
                    </Button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <p>
                        {format(service.selected_date, "HH:mm") +
                          ` ${service.selected_worker.name}`}
                      </p>
                      <Link
                        component="button"
                        variant="body2"
                        sx={{ pl: "5px" }}
                        onClick={() => {
                          handleDialogOpen(service);
                        }}
                      >
                        {"edit"}
                      </Link>
                    </div>
                  )}
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
        {/* <DatePickerSection /> */}
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
            />
          </LocalizationProvider>
        </div>

        <Divider variant="middle" />
        {/* <BuildTitle title="Choose staff and time" /> */}
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

      {!canDialogOpen && (
        <MyDateDialog
          key={serviceForDialog}
          service={serviceForDialog}
          bookings={bookings}
          workers={workers}
          shopTimeLine={shopTimeLine}
          dialogOpen={dialogOpen}
          handleDialogSave={handleDialogSave}
          handleDialogClose={handleDialogClose}
          date={selectedDate}
          offDays={offDays}
          alreadyAdded={compact(
            services.map((e) => {
              if (!e?.selected_date || !e?.selected_worker?.id) {
                return undefined;
              }
              return {
                date: e?.selected_date,
                worker_id: e?.selected_worker?.id,
                service_id: e?.id,
                duration: e?.duration,
              };
            })
          )}
        />
      )}

      <Footer />
      <Bottom />
    </>
  );
}
