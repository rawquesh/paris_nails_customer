import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";

import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";

import "./index.css";
import Services from "./pages/services/view";
import Login from "./pages/login/view";
import SignUp from "./pages/signup/view";
import Home from "./pages/home/view";
import ForgotPassword from "./pages/forgot_password/view";

import { UserAuthContextProvider } from "./utils/context";
import ProtectedRoute from "./utils/protected_route";
import Account from "./pages/account/account";
// import LoggedInRoute from "./utils/logged_routes";

function App() {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <UserAuthContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="Services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </UserAuthContextProvider>
    </ThemeConfig>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
