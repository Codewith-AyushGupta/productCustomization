import React, { useEffect, useState } from 'react';

function Customizer() {
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState('0 0 500 500');
  const [colors, setColors] = useState({});
  const [logoURL, setLogoURL] = useState(null);

  useEffect(() => {
    fetch('/svg/image.svg')
      .then(res => res.text())
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'image/svg+xml');
        setViewBox(doc.documentElement.getAttribute('viewBox') || '0 0 500 500');

        const newPaths = ['path0', 'path1', 'path2'].map(id => {
          const el = doc.getElementById(id);
          if (el) {
            return {
              id,
              d: el.getAttribute('d'),
            };
          }
          return null;
        }).filter(Boolean);

        setPaths(newPaths);
      });
  }, []);

  const handleColorChange = (id, value) => {
    setColors(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoURL(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      
      {/* SVG + Image + Logo Preview */}
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
          
          {/* SVG Underlay */}
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
                fill={colors[id] || 'rgba(255,255,255,0.5)'}
                stroke="black"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Image Overlay */}
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
              opacity: 0.8 // Optional: slightly transparent to see SVG underneath
            }}
          />

          {/* Logo Overlay */}
          {logoURL && (
            <img
              src={logoURL}
              alt="Logo"
              style={{
                position: 'absolute',
                top: '35%', // Position on chest
                left: '40%',
                width: '20%',
                height: 'auto',
                zIndex: 3,
                pointerEvents: 'none',
                opacity: 1,
              }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, padding: '10px' }}>
        <h3>Customize Colors</h3>
        {['path0', 'path1', 'path2'].map(id => (
          <div key={id} style={{ marginBottom: '20px' }}>
            <label>
              {id.toUpperCase()} Color:{' '}
              <input
                type="color"
                value={colors[id] || '#ffffff'}
                onChange={e => handleColorChange(id, e.target.value)}
              />
            </label>
          </div>
        ))}

        <h3>Upload Logo</h3>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
      </div>
    </div>
  );
}

export default Customizer;
