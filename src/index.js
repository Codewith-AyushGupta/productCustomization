import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AprealCustomizer from "./components/aprealCustomizer";
import Customizer from "./components/customizer";
import NonAprealCustomizer from "./components/nonAprealCustomizer";
import CustomiseTab from "./components/CustomiseTab"; 
import ProductJsonCreation from "./components/ProductJsonCreation";

function Root() {
  const location = useLocation(); // ✅ from react-router-dom

  return (
    <>
      {location.pathname !== "/admin" && <CustomiseTab />}
      <Routes>
        <Route path="/apreal" element={<AprealCustomizer />} />
        <Route path="/non-apreal" element={<NonAprealCustomizer />} />
        <Route path="/admin" element={<ProductJsonCreation />} />
        <Route path="*" element={<AprealCustomizer />} />
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);
