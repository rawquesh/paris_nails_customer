// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useUserAuth } from "./context";

const LoggedInRoute = ({ children }) => {
  // const { user } = useUserAuth();

  // if (!user) {
  //     return children;
  //   }
  //   console.log("Youre Already loggedin: ", user);
  //   console.log(user);
  // return <Navigate to="/account" />;
  return children;
};

export default LoggedInRoute;
