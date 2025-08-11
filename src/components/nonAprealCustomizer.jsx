import React, { useEffect, useRef, useState } from "react";
import { Canvas, Image, Path, Text } from "fabric";

function MugCustomizerFabric() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const [paths, setPaths] = useState([]);
  const [colors, setColors] = useState({});
  const [initials, setInitials] = useState("");
  const [initialsColor, setInitialsColor] = useState("#000000");
  const [logoURL, setLogoURL] = useState(null);

  // Initialize Fabric Canvas
  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      selection: false,
    });
    fabricCanvas.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load Base Mug Image
  useEffect(() => {
    if (!fabricCanvas.current) return;
    Image.fromURL("/png/mug-Photoroom.png").then((img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: fabricCanvas.current.width / img.width,
        scaleY: fabricCanvas.current.height / img.height,
      });
     fabricCanvas.current.backgroundImage = img;
fabricCanvas.current.requestRenderAll();

    });
  }, []);

  // Load SVG paths
  useEffect(() => {
    fetch("/svg/mugsvg.svg")
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

        svgPaths.forEach((pathObj) => {
          const path = new Path(pathObj.d, {
            fill: colors[pathObj.id] || "#ffffff",
            stroke: "black",
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
          });
          path.customId = pathObj.id;
          fabricCanvas.current.add(path);
        });

        fabricCanvas.current.renderAll();
      });
  }, []);

  // Update path colors dynamically
  useEffect(() => {
    if (!fabricCanvas.current) return;
    fabricCanvas.current.getObjects().forEach((obj) => {
      if (obj.customId && colors[obj.customId]) {
        obj.set("fill", colors[obj.customId]);
      }
    });
    fabricCanvas.current.renderAll();
  }, [colors]);

  
 // Load Base Mug Image
useEffect(() => {
  if (!fabricCanvas.current) return;
  Image.fromURL("/png/mug-Photoroom.png").then((img) => {
    img.set({
      left: 0,
      top: 0,
      selectable: false,
      evented: false,
      scaleX: fabricCanvas.current.width / img.width,
      scaleY: fabricCanvas.current.height / img.height,
    });

    fabricCanvas.current.backgroundImage = img;
    fabricCanvas.current.requestRenderAll();
  });
}, []);


  // Update Logo
  useEffect(() => {
    if (!fabricCanvas.current) return;
    let logoObj = fabricCanvas.current
      .getObjects()
      .find((o) => o.id === "logo");
    if (logoObj) {
      fabricCanvas.current.remove(logoObj);
    }
    if (logoURL) {
      Image.fromURL(logoURL).then((img) => {
        img.set({
          left: fabricCanvas.current.width * 0.34,
          top: fabricCanvas.current.height * 0.24,
          scaleX: 0.08,
          scaleY: 0.08,
          selectable: true,
        });
        img.id = "logo";
        fabricCanvas.current.add(img);
        fabricCanvas.current.renderAll();
      });
    }
  }, [logoURL]);

  return (
    <div style={{ display: "flex", padding: "30px", gap: "30px" }}>
      {/* Preview */}
      <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
        <canvas ref={canvasRef} />
      </div>

      {/* Controls */}
      <div style={{ flex: 1, padding: "10px" }}>
        <h2>Mug Customizer</h2>

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

        <section style={{ marginBottom: "30px" }}>
          <h4>Upload Logo</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogoURL(URL.createObjectURL(e.target.files[0]))
            }
          />
        </section>

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

export default MugCustomizerFabric;
