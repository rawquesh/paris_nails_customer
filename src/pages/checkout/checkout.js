import React, { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state?.services);
  }, []);

  if (!location.state?.services) {
    return <Navigate to="/" />;
  }
  return <div>Checkout</div>;
}
