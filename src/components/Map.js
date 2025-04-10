// src/components/Map.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';


mapboxgl.accessToken = 'pk.eyJ1IjoicHVyZWJsYWNrZ3QiLCJhIjoiY204ZXBjY3h4MDN2djJqcTF3NzBzMzF1YiJ9.wqzDX9axunSDlWsdENGpCw';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Default location for PSU Abington
  const DEFAULT_LOCATION = {
    lng: -75.1652,
    lat: 40.1406,
    name: 'PSU Abington'
  };

  useEffect(() => {
    if (!mapboxgl || !mapboxgl.supported()) {
      setMapError('Mapbox is not supported in this browser');
      return;
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
        zoom: 15
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      // Map load event
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);

        // Add marker for PSU Abington
        new mapboxgl.Marker({ color: '#041E42' })
          .setLngLat([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${DEFAULT_LOCATION.name}</h3>`))
          .addTo(map.current);
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Map load error:', e);
        setMapError('Failed to load map');
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Could not initialize map');
    }

    // Cleanup on unmount
    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  const viewInStreetView = () => {
    navigate('/streetview');
  };

  // If there's a map error, show error message
  if (mapError) {
    return (
      <div className="map-container">
        <div className="map-header">
          <h1>Map Error</h1>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
        <div className="map-loading">
          <p>{mapError}</p>
          <p>Please check your internet connection or Mapbox token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>PSU Abington Campus Map</h1>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
      
      <div className="map-controls">
        <form className="search-form">
          <input
            type="text"
            placeholder="Search campus buildings..."
            className="search-input"
          />
          <button type="submit" className="search-button">Find</button>
        </form>
        
        <button onClick={viewInStreetView} className="street-view-button">
          View in Street View
        </button>
      </div>
      
      <div ref={mapContainer} className="map-display">
        {!mapLoaded && <div className="map-loading">Loading map...</div>}
      </div>
      
      <div className="map-footer">
        <p>
          PSU Abington Campus Navigator |{' '}
          <a href="#" className="footer-link">Report an issue</a>
        </p>
      </div>
    </div>
  );
};

export default Map;
