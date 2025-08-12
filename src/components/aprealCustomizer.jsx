import React, { useEffect, useRef, useState } from "react";
import { Canvas, Image, Path, Text, Rect } from "fabric";

function AprealCustomizer() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const [paths, setPaths] = useState([]);
  const [colors, setColors] = useState({});
  const [initials, setInitials] = useState("");
  const [initialsColor, setInitialsColor] = useState("#000000");
  const [logoURL, setLogoURL] = useState(null);

  // Define fixed placement zones
  const logoBounds = { x: 150, y: 150, w: 200, h: 150 };
  const initialsBounds = { x: 150, y: 400, w: 200, h: 50 };

  // Initialize Fabric Canvas
  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      selection: false,
    });
    fabricCanvas.current = canvas;

    // Draw bounding boxes (for reference)
    const logoBox = new Rect({
      left: logoBounds.x,
      top: logoBounds.y,
      width: logoBounds.w,
      height: logoBounds.h,
      fill: "rgba(0, 255, 0, 0.1)",
      stroke: "green",
      selectable: true,
      evented: true,
    });
    const initialsBox = new Rect({
      left: initialsBounds.x,
      top: initialsBounds.y,
      width: initialsBounds.w,
      height: initialsBounds.h,
      fill: "rgba(0, 0, 255, 0.1)",
      stroke: "blue",
      selectable: true,
      evented: true,
    });

    canvas.add(logoBox);
    canvas.add(initialsBox);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load SVG paths first, then PNG overlay on top
  useEffect(() => {
    if (!fabricCanvas.current) return;

    fetch("/svg/ball.svg")
      .then((res) => res.text())
      .then((xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "image/svg+xml");
        const pathElements = doc.querySelectorAll("path[id]");

        const svgPaths = Array.from(pathElements).map((el) => ({
          id: el.id,
          d: el.getAttribute("d"),
        }));

        setPaths(svgPaths);

        // Add SVG paths
        svgPaths.forEach((pathObj) => {
          const path = new Path(pathObj.d, {
            fill: colors[pathObj.id] || "#ffffff",
            stroke: "black",
            strokeWidth: 0.5,
            selectable: true,
            evented: true,
          });
          path.customId = pathObj.id;
          fabricCanvas.current.add(path);
        });

        fabricCanvas.current.renderAll();

        // Load PNG image on top of SVG
        Image.fromURL("/png/ball.png").then((img) => {
          img.set({
              left: 65,
            top: 0,
            width: 400,
            selectable: true,
            evented: true,
            opacity: 0.7,
            globalCompositeOperation: "multiply"
          });
          fabricCanvas.current.add(img);
          fabricCanvas.current.renderAll();
        });
      });
  }, []);

  // Update SVG path colors
  useEffect(() => {
    if (!fabricCanvas.current) return;
    fabricCanvas.current.getObjects().forEach((obj) => {
      if (obj.customId && colors[obj.customId]) {
        obj.set("fill", colors[obj.customId]);
      }
    });
    fabricCanvas.current.renderAll();
  }, [colors]);

  // Add / Update Logo with bounds
  useEffect(() => {
    if (!fabricCanvas.current) return;

    let logoObj = fabricCanvas.current.getObjects().find((o) => o.id === "logo");
    if (logoObj) {
      fabricCanvas.current.remove(logoObj);
    }

    if (logoURL) {
      Image.fromURL(logoURL).then((img) => {
        img.set({
          left: logoBounds.x + 10,
          top: logoBounds.y + 10,
          scaleX: 0.08,
          scaleY: 0.08,
          selectable: true,
          lockRotation: true,
        });
        img.id = "logo";

        // Restrict movement inside bounds
        img.on("moving", function () {
          const obj = this;
          if (obj.left < logoBounds.x) obj.left = logoBounds.x;
          if (obj.top < logoBounds.y) obj.top = logoBounds.y;
          if (obj.left + obj.width * obj.scaleX > logoBounds.x + logoBounds.w) {
            obj.left = logoBounds.x + logoBounds.w - obj.width * obj.scaleX;
          }
          if (obj.top + obj.height * obj.scaleY > logoBounds.y + logoBounds.h) {
            obj.top = logoBounds.y + logoBounds.h - obj.height * obj.scaleY;
          }
        });

        fabricCanvas.current.add(img);
        fabricCanvas.current.renderAll();
      });
    }
  }, [logoURL]);

  // Add / Update Initials with bounds
  useEffect(() => {
    if (!fabricCanvas.current) return;

    let textObj = fabricCanvas.current.getObjects().find((o) => o.id === "initials");
    if (textObj) {
      fabricCanvas.current.remove(textObj);
    }

    if (initials.trim()) {
      const text = new Text(initials, {
        left: initialsBounds.x + 10,
        top: initialsBounds.y + 10,
        fill: initialsColor,
        fontSize: 30,
        fontWeight: "bold",
        selectable: true,
        lockRotation: true,
      });
      text.id = "initials";

      // Restrict movement inside bounds
      text.on("moving", function () {
        const obj = this;
        if (obj.left < initialsBounds.x) obj.left = initialsBounds.x;
        if (obj.top < initialsBounds.y) obj.top = initialsBounds.y;
        if (obj.left + obj.width * obj.scaleX > initialsBounds.x + initialsBounds.w) {
          obj.left = initialsBounds.x + initialsBounds.w - obj.width * obj.scaleX;
        }
        if (obj.top + obj.height * obj.scaleY > initialsBounds.y + initialsBounds.h) {
          obj.top = initialsBounds.y + initialsBounds.h - obj.height * obj.scaleY;
        }
      });

      fabricCanvas.current.add(text);
    }

    fabricCanvas.current.renderAll();
  }, [initials, initialsColor]);

  return (
    <div style={{ display: "flex", padding: "30px", gap: "30px" }}>
      {/* Canvas Preview */}
      <div
        style={{
          flex: 1,
          border: "2px solid #00e74dff",
          borderRadius: "8px",
          padding: "15px",
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Controls */}
      <div style={{ flex: 1, padding: "10px" }}>
        <h2>Mug Customizer</h2>

        {/* Color Pickers */}
        <section style={{ marginBottom: "30px" }}>
          <h4>Customize Colors</h4>
          {paths.map(({ id }) => (
            <div key={id} style={{ margin: "10px 0" }}>
              <label>
                <strong>{id.toUpperCase()}</strong> Color:&nbsp;
                <input
                  type="color"
                  value={colors[id] || "#ffffff"}
                  onChange={(e) =>
                    setColors((prev) => ({ ...prev, [id]: e.target.value }))
                  }
                />
              </label>
            </div>
          ))}
        </section>

        {/* Logo Upload */}
        <section style={{ marginBottom: "30px" }}>
          <h4>Upload Logo</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoURL(URL.createObjectURL(e.target.files[0]))}
          />
        </section>

        {/* Initials */}
        <section>
          <h4>Add Initials</h4>
          <input
            type="text"
            placeholder="Enter initials..."
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            style={{ padding: "5px", width: "80%" }}
          />
          <div style={{ marginTop: "10px" }}>
            <label>
              Initials Color:&nbsp;
              <input
                type="color"
                value={initialsColor}
                onChange={(e) => setInitialsColor(e.target.value)}
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AprealCustomizer;



