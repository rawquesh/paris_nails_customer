import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/functions/toast";
import useQuery from "../../utils/functions/use_query";

export default function ChooseStaffTime() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    let ids = useQuery().get("ids").split("|");

    if (ids.length > 10) {
      navigate('/')
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

  return <div>ChooseStaffTime</div>;
}
