import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./home/view";

import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import services from "./services/view";
import { Routes } from "react-router-dom";

function App() {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route exact path="/" component={Home} />
          <Route exact path="/services" component={services} />
        </Routes>
      </Router>
    </ThemeConfig>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
