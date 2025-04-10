// src/components/QrCodeList.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './QrCodeList.css';

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

function QrCodeList() {
  const navigate = useNavigate();

  const handleGoToFloor = (floorValue) => {
    // Navigate to the dedicated page for that floor’s QR code
    navigate(`/floors/${floorValue}`);
  };

  return (
    <div className="qr-code-list-container">
      <header>
        <h1>Select a Floor for QR Code</h1>
        {/* NEW: Return Home button/link */}
        <Link to="/" className="home-link">
          Return Home
        </Link>
      </header>

      <div className="qr-code-list">
        {floors.map((floor) => (
          <div key={floor.value} className="qr-code-list-item">
            <span>{floor.label}</span>
            <button onClick={() => handleGoToFloor(floor.value)}>View QR Code</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QrCodeList;
