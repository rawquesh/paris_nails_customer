import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject } from "../../utils/functions/firestore";
import { showToast } from "../../utils/functions/toast";
import useQuery from "../../utils/functions/use_query";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";

export default function ChooseStaffTime() {
  const navigate = useNavigate();
  const query = useQuery();

  const [services, setServices] = useState([]);

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

  return (
    <div>
      <NavBar />
      <Heading title="Choose a day & time" />
      <Footer />
      <Bottom />
    </div>
  );
}
