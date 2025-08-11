import React, { useEffect, useState } from 'react';

function AprealCustomizer() {
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState('0 0 500 500');
  const [colors, setColors] = useState({});
  const [initials, setInitials] = useState('');
  const [initialsColor, setInitialsColor] = useState('#000000');
  const [logoURL, setLogoURL] = useState(null);

  const [logoPosition, setLogoPosition] = useState(null);
  const [initialsPosition, setInitialsPosition] = useState(null);

  // Load SVG dynamically
  useEffect(() => {
    fetch('/svg/image.svg')
      .then(res => res.text())
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'image/svg+xml');

        // ViewBox
        setViewBox(doc.documentElement.getAttribute('viewBox') || '0 0 500 500');

        // Paths with IDs and labels
        const pathElements = doc.querySelectorAll('path[id]');
        
        const newPaths = Array.from(pathElements).map(el => ({
          id: el.id,
          label: el.getAttribute('label') || el.id, // ✅ Fixed here
          d: el.getAttribute('d'),
        }));
        setPaths(newPaths);

        // Initials (rect)
        const initialsEl = doc.getElementById('initials');
        if (initialsEl) {
          setInitialsPosition({
            x: parseFloat(initialsEl.getAttribute('x')),
            y: parseFloat(initialsEl.getAttribute('y')),
            width: parseFloat(initialsEl.getAttribute('width')),
            height: parseFloat(initialsEl.getAttribute('height')),
          });
        }

        // Logo (ellipse)
        const logoEl = doc.getElementById('logo');
        if (logoEl) {
          setLogoPosition({
            cx: parseFloat(logoEl.getAttribute('cx')),
            cy: parseFloat(logoEl.getAttribute('cy')),
            rx: parseFloat(logoEl.getAttribute('rx')),
            ry: parseFloat(logoEl.getAttribute('ry')),
          });
        }
      });
  }, []);

  // Handlers
  const handleColorChange = (id, value) => {
    setColors(prev => ({ ...prev, [id]: value }));
  };

  const handleInitialsChange = (e) => {
    setInitials(e.target.value);
  };

  const handleInitialsColorChange = (e) => {
    setInitialsColor(e.target.value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoURL(URL.createObjectURL(file));
    }
  };

  // Helpers for positioning logo & initials
  const getPositionStyle = (position) => {
    if (!position) return {};
    const { x, y, width, height, cx, cy, rx, ry } = position;

    if ('x' in position && 'y' in position) {
      // Rectangle (initials)
      return {
        position: 'absolute',
        top: `${(y / 500) * 100}%`,
        left: `${(x / 500) * 100}%`,
        width: `${(width / 500) * 100}%`,
        height: `${(height / 500) * 100}%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(0, 0)',
      };
    } else if ('cx' in position && 'cy' in position) {
      // Ellipse (logo)
      return {
        position: 'absolute',
        top: `${((cy - ry) / 500) * 100}%`,
        left: `${((cx - rx) / 500) * 100}%`,
        width: `${(rx * 2 / 500) * 100}%`,
        height: `${(ry * 2 / 500) * 100}%`,
        objectFit: 'contain',
        transform: 'translate(0, 0)',
      };
    }

    return {};
  };

  return (
    <div style={{ display: 'flex', padding: '30px', gap: '30px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Preview Section */}
      <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '15px', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
          
          {/* SVG Overlays */}
          <svg
            viewBox={viewBox}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {paths.map(({ id, d }) => (
              <path
                key={id}
                d={d}
                fill={colors[id] || '#ffffff'}
                stroke="black"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Base T-Shirt Image */}
          <img
            src="/png/image.png"
            alt="T-shirt"
            style={{
              position: 'absolute',
              top: 0,
              left: '3px',
              width: '100%',
              height: '100%',
              transform: 'scaleX(0.94)',
              objectFit: 'contain',
              zIndex: 2,
              opacity: 0.85
            }}
          />

          {/* Logo Overlay */}
          {logoURL && logoPosition && (
            <img
              src={logoURL}
              alt="Logo"
              style={{
                ...getPositionStyle(logoPosition),
                zIndex: 3,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Initials Overlay */}
          {initials && initialsPosition && (
            <div
              style={{
                ...getPositionStyle(initialsPosition),
                color: initialsColor,
                fontSize: '1.2em',
                fontWeight: 'bold',
                zIndex: 4,
                textAlign: 'center',
              }}
            >
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div style={{ flex: 1, padding: '10px' }}>
        <h2 style={{ marginBottom: '20px' }}>T-Shirt Customizer</h2>

        <section style={{ marginBottom: '30px' }}>
          <h4>Customize Colors</h4>
          {paths.map(({ id, label }) => (
            <div key={id} style={{ margin: '10px 0' }}>
              <label>
                <strong>{label}</strong> Color:&nbsp;
                <input
                  type="color"
                  value={colors[id] || '#ffffff'}
                  onChange={e => handleColorChange(id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h4>Upload Logo</h4>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
        </section>

        <section>
          <h4>Add Initials</h4>
          <input
            type="text"
            placeholder="Enter initials..."
            value={initials}
            onChange={handleInitialsChange}
            style={{ padding: '5px', width: '80%' }}
          />
          <div style={{ marginTop: '10px' }}>
            <label>
              Initials Color:&nbsp;
              <input
                type="color"
                value={initialsColor}
                onChange={handleInitialsColorChange}
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AprealCustomizer;
