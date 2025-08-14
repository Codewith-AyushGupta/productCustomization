import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  const accordionHeader = {
    padding: "14px 16px",
    background: "#ffffff",
    fontWeight: "600",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "background 0.2s ease",
  };

  const accordionContainer = {
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
    marginBottom: "14px",
  };

  return (
    <div style={accordionContainer}>
      <div
        style={accordionHeader}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fa")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
      >
        {title}
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          {open ? "−" : "+"}
        </span>
      </div>
      {open && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

export default function ProductJsonCreation() {
   const navigate = useNavigate();
  const [product, setProduct] = useState({
    svgPath: "",
    productImage: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productSlug: "",
    productType: "",
    variantOptions: [],
    customizationMatrix: [],
  });

  const [variantName, setVariantName] = useState("");
  const [variantValues, setVariantValues] = useState([]);
  const [variantValueName, setVariantValueName] = useState("");
  const [variantValueCode, setVariantValueCode] = useState("");

  const [customLabel, setCustomLabel] = useState("");
  const [customMaxChar, setCustomMaxChar] = useState("");
  const [customSvgId, setCustomSvgId] = useState("");
  const [customPlaceholder, setCustomPlaceholder] = useState("");
  const [customRequired, setCustomRequired] = useState(false);

  const inputStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    width: "100%",
    marginBottom: "8px",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#fff",
    fontSize: "14px",
    transition: "background 0.2s ease, transform 0.1s ease",
  };

  const handleAddVariantValue = () => {
    if (variantValueName && variantValueCode) {
      setVariantValues([
        ...variantValues,
        { name: variantValueName, value: variantValueCode },
      ]);
      setVariantValueName("");
      setVariantValueCode("");
    }
  };

  const handleAddVariantOption = () => {
    if (variantName && variantValues.length > 0) {
      setProduct((prev) => {
        const existingIndex = prev.variantOptions.findIndex(
          (v) => v.name.toLowerCase() === variantName.toLowerCase()
        );

        if (existingIndex > -1) {
          const updatedVariants = [...prev.variantOptions];
          const existingValues = updatedVariants[existingIndex].values;

          const mergedValues = [
            ...existingValues,
            ...variantValues.filter(
              (nv) =>
                !existingValues.some(
                  (ev) => ev.name.toLowerCase() === nv.name.toLowerCase()
                )
            ),
          ];

          updatedVariants[existingIndex] = {
            ...updatedVariants[existingIndex],
            values: mergedValues,
          };

          return { ...prev, variantOptions: updatedVariants };
        } else {
          return {
            ...prev,
            variantOptions: [
              ...prev.variantOptions,
              { name: variantName, values: variantValues },
            ],
          };
        }
      });

      setVariantName("");
      setVariantValues([]);
    }
  };

  const handleAddCustomization = () => {
    setProduct({
      ...product,
      customizationMatrix: [
        ...product.customizationMatrix,
        {
          label: customLabel,
          type: "text",
          maxCharacter: parseInt(customMaxChar),
          svgElementId: customSvgId,
          placeHolder: customPlaceholder,
          isRequired: customRequired,
          svgElementIds: customSvgId,
        },
      ],
    });
    setCustomLabel("");
    setCustomMaxChar("");
    setCustomSvgId("");
    setCustomPlaceholder("");
    setCustomRequired(false);
  };

  const downloadJSON = () => {
    const json = JSON.stringify([product], null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "product.json";
    link.click();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "850px",
        margin: "auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "18px",
          color: "#333",
        }}
      >
        Product JSON Builder
      </h1>

      <Accordion title="Product Details">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              flex: 1 / 5,
              padding: "8px",
              fontSize: "14px",
              background: "#fff",
              color: product.svgPath ? "#999" : "#999",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {"svg Path"}
          </div>

          <input
            type="file"
            accept=".svg"
            style={{
              flexShrink: 0,
              padding: "8px",
              cursor: "pointer",
              borderLeft: "1px solid #ccc",
            }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProduct({
                  ...product,
                  svgPath: `/images/${file.name}`,
                });
              }
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              flex: 1 / 5,
              padding: "8px",
              fontSize: "14px",
              background: "#fff",
              color: product.productImage ? "#999" : "#999",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {"Product Image"}
          </div>

          <input
            type="file"
            accept="image/*"
            style={{
              flexShrink: 0,
              padding: "8px",
              cursor: "pointer",
              borderLeft: "1px solid #ccc",
            }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProduct({
                  ...product,
                  productImage: `/images/${file.name}`,
                });
              }
            }}
          />
        </div>

        <input
          style={inputStyle}
          placeholder="Product Name"
          value={product.productName}
          onChange={(e) =>
            setProduct({ ...product, productName: e.target.value })
          }
        />
        <textarea
          style={{ ...inputStyle, minHeight: "80px" }}
          placeholder="Product Description"
          value={product.productDescription}
          onChange={(e) =>
            setProduct({ ...product, productDescription: e.target.value })
          }
        />
        <input
          style={inputStyle}
          type="number"
          placeholder="Product Price"
          value={product.productPrice}
          onChange={(e) =>
            setProduct({ ...product, productPrice: parseFloat(e.target.value) })
          }
        />
        <input
          style={inputStyle}
          placeholder="Product Slug"
          value={product.productSlug}
          onChange={(e) =>
            setProduct({ ...product, productSlug: e.target.value })
          }
        />
        <input
          style={inputStyle}
          placeholder="Product Type"
          value={product.productType}
          onChange={(e) =>
            setProduct({ ...product, productType: e.target.value })
          }
        />
      </Accordion>

      <Accordion title="Variant Options">
        <input
          style={inputStyle}
          placeholder="Variant Name (e.g., Color)"
          value={variantName}
          onChange={(e) => setVariantName(e.target.value)}
        />
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Value Name"
            value={variantValueName}
            onChange={(e) => setVariantValueName(e.target.value)}
          />
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Value Code"
            value={variantValueCode}
            onChange={(e) => setVariantValueCode(e.target.value)}
          />
          <button
            style={{ ...buttonStyle, backgroundColor: "#007bff" }}
            onClick={handleAddVariantValue}
          >
            Add
          </button>
        </div>
        <div style={{ marginBottom: "8px", fontSize: "14px", color: "#555" }}>
          Current Values:{" "}
          {variantValues.map((v) => `${v.name} (${v.value})`).join(", ")}
        </div>
        <button
          style={{ ...buttonStyle, backgroundColor: "green" }}
          onClick={handleAddVariantOption}
        >
          Save Variant Option
        </button>
      </Accordion>

      <Accordion title="Customization Matrix">
        <input
          style={inputStyle}
          placeholder="Label"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
        />
        <input style={inputStyle} value="Text" disabled />
        <input
          style={inputStyle}
          placeholder="Max Characters"
          type="number"
          value={customMaxChar}
          onChange={(e) => setCustomMaxChar(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="SVG Element ID"
          value={customSvgId}
          onChange={(e) => setCustomSvgId(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Placeholder"
          value={customPlaceholder}
          onChange={(e) => setCustomPlaceholder(e.target.value)}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          <input
            type="checkbox"
            checked={customRequired}
            onChange={(e) => setCustomRequired(e.target.checked)}
          />
          Required
        </label>
        <button
          style={{ ...buttonStyle, backgroundColor: "green" }}
          onClick={handleAddCustomization}
        >
          Save Customization
        </button>
      </Accordion>

      <Accordion title="Preview JSON">
      <pre
        style={{
          background: "#f5f5f5",
          padding: "14px",
          fontSize: "13px",
          overflowX: "auto",
          borderRadius: "6px",
        }}
      >
        {JSON.stringify([product], null, 2)}
      </pre>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          style={{ ...buttonStyle, backgroundColor: "purple" }}
          onClick={downloadJSON}
        >
          Download JSON
        </button>

       <button
  style={{ ...buttonStyle, backgroundColor: "orange" }}
  onClick={() => window.open("/apreal", "_blank")}
>
  Preview
</button>

      </div>
    </Accordion>
    </div>
  );
}
