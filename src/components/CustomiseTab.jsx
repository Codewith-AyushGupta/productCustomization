import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function CustomiseTab() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: 20 , justifyContent: "center" }}>
      <button
        onClick={() => navigate("/apreal")}
        style={{
          padding: "10px 20px",
          backgroundColor: location.pathname === "/apreal" ? "#4caf50" : "#ccc",
          color: location.pathname === "/apreal" ? "white" : "black",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Apreal Customizer
      </button>
      <button
        onClick={() => navigate("/non-apreal")}
        style={{
          padding: "10px 20px",
          backgroundColor:
            location.pathname === "/non-apreal" ? "#4caf50" : "#ccc",
          color: location.pathname === "/non-apreal" ? "white" : "black",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Non Apreal Customizer
      </button>
    </div>
  );
}

export default CustomiseTab;
