import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AprealCustomizer from "./components/aprealCustomizer";
import Customizer from "./components/customizer";
import NonAprealCustomizer from "./components/nonAprealCustomizer";
import CustomiseTab from "./components/CustomiseTab"; 

const root = ReactDOM.createRoot(document.getElementById("root"));

function Root() {
  return (
    <>
      <CustomiseTab />
      <Routes>
        <Route path="/apreal" element={<AprealCustomizer />} />
        <Route path="/non-apreal" element={<NonAprealCustomizer />} />
        {/* Optionally redirect default path */}
        <Route path="*" element={<AprealCustomizer />} />
      </Routes>
    </>
  );
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Routes>
        <Route path="/apreal" element={<AprealCustomizer />} />
        <Route path="/non-apreal" element={<NonAprealCustomizer />} />
        <Route path="/customizer" element={<Customizer />} />
      </Routes> */}
      <Root />

    </BrowserRouter>
  </React.StrictMode>
);
