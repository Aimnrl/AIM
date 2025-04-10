// src/components/FloorQrCode.js
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './FloorQrCode.css';

function FloorQrCode() {
  const navigate = useNavigate();
  const { floorParam } = useParams();

  const getFloorLabel = (param) => {
    switch (param) {
      case 'woodland-1st': return 'Woodland 1st Floor';
      case 'woodland-2nd': return 'Woodland 2nd Floor';
      case 'woodland-3rd': return 'Woodland 3rd Floor';
      case 'sutherland-1st': return 'Sutherland 1st Floor';
      case 'sutherland-2nd': return 'Sutherland 2nd Floor';
      case 'sutherland-3rd': return 'Sutherland 3rd Floor';
      case 'rydal-1st': return 'Rydal 1st Floor';
      case 'rydal-2nd': return 'Rydal 2nd Floor';
      default: return 'Unknown Floor';
    }
  };

  const floorLabel = getFloorLabel(floorParam);

  // Scanned link for phone camera → Map with ?floor= param
  const mapUrl = `${window.location.origin}/map?floor=${floorParam}`;

  // We’ll add a button that navigates to /streetview?floor=woodland-1st
  const goToStreetView = () => {
    navigate(`/streetview?floor=${floorParam}`);
  };

  return (
    <div className="floor-qrcode-container">
      <header>
        <h1>{floorLabel} QR Code</h1>
        <Link to="/floors" className="back-link">
          Back to All Floors
        </Link>
      </header>

      <div className="qr-wrapper">
        <QRCodeSVG
          value={mapUrl}
          size={256}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#041E42"
        />
      </div>

      <p className="qr-instructions">
        Scan this code to open the <strong>Map</strong> focused on {floorLabel}.
      </p>

      {/* NEW: Button to jump directly to StreetView for this floor */}
      <button onClick={goToStreetView} className="streetview-button">
        Go to StreetView for {floorLabel}
      </button>
    </div>
  );
}

export default FloorQrCode;
