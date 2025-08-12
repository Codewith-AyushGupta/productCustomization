import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AprealCustomizer from "./components/aprealCustomizer";
import NonAprealCustomizer from "./components/nonAprealCustomizer"; // Capitalized
import Customizer from "./components/customizer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/apreal" element={<AprealCustomizer />} />
        <Route path="/non-apreal" element={<NonAprealCustomizer />} />
        <Route path="/customizer" element={<Customizer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
