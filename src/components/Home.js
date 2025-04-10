// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Home.css';

// Define the floors you want to display
const floors = [
  { label: 'Woodland 1st Floor', value: 'woodland-1st' },
  { label: 'Woodland 2nd Floor', value: 'woodland-2nd' },
  { label: 'Woodland 3rd Floor', value: 'woodland-3rd' },
  { label: 'Sutherland 1st Floor', value: 'sutherland-1st' },
  { label: 'Sutherland 2nd Floor', value: 'sutherland-2nd' },
  { label: 'Sutherland 3rd Floor', value: 'sutherland-3rd' },
  { label: 'Rydal 1st Floor', value: 'rydal-1st' },
  { label: 'Rydal 2nd Floor', value: 'rydal-2nd' },
];

function Home() {
  const navigate = useNavigate();

  // For demonstration, the "manual entry" is still here, in case you want it:
  const handleManualEntry = () => {
    navigate('/map?location=PSU%20Abington');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>PSU Campus Navigator</h1>
        <p>Below are QR codes for each floor. Scan or click the button below each QR code for more details.</p>
      </header>

      {/* NEW: Display all floor QR codes */}
      <div className="all-floors-section">
        {floors.map((floor) => {
          // The QR code will link to "/map?floor=floor.value"
          // so scanning it opens the map at the specified floor param.
          const qrValue = `${window.location.origin}/map?floor=${floor.value}`;

          return (
            <div key={floor.value} className="floor-card">
              <h2 className="floor-label">{floor.label}</h2>
              <div className="qr-code-container">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#041E42"
                />
              </div>
              <button
                className="floor-button"
                onClick={() => navigate(`/floors/${floor.value}`)}
              >
                View {floor.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Optional: Keep or remove this "Manual Entry" section */}
      <div className="manual-section">
        <p>Can't scan the QR code?</p>
        <button onClick={handleManualEntry} className="manual-button">
          Go to PSU Abington Map
        </button>
      </div>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} PSU Campus Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
