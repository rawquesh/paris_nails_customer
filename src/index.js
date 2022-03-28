import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./home/view";
import Services from "./services/view";

import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import { Routes } from "react-router-dom";

function App() {
  return (    
    <ThemeConfig>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Services" element={<Services />} />
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
