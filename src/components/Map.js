// src/components/Map.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'; // Import Directions plugin
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import './Map.css';


mapboxgl.accessToken = 'pk.eyJ1IjoibWdyNTIyMiIsImEiOiJjbTc2ZXNpMGcwN3ZuMmxwemhwNm8wbGtkIn0.J_dUFY-gCI7HqbzWC9Gy_A';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Default location for PSU Abington
  const DEFAULT_LOCATION = {
    lng: -75.10994916422415,
    lat: 40.116222905939183,
    name: 'PSU Abington',
    zoom: 1000
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
        style: 'mapbox://styles/mgr5222/cm9oev4nt00em01rz9tod2f7b',
        center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
        zoom: 18,
        pitch: 45,
        bearing: -17.6
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add directions control
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/walking'
      });
      map.current.addControl(directions, 'top-left');

      // Fetch GeoJSON data dynamically
      fetch('/abington-entrances.geojson')
        .then((response) => response.json())
        .then((geojson) => {
          // Add markers from GeoJSON data
          for (const feature of geojson.features) {
            const marker = new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat(feature.geometry.coordinates)
              .setPopup(
                new mapboxgl.Popup().setHTML(`<h3>${feature.properties.location}</h3>`)
              )
              .addTo(map.current);

            // Add click event to marker
            marker.getElement().addEventListener('click', () => {
              // Use Geolocation API to get user's current location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const userLocation = [
                      position.coords.longitude,
                      position.coords.latitude
                    ];

                    // Set the route from user's location to the marker
                    directions.setOrigin(userLocation); // Starting point
                    directions.setDestination(feature.geometry.coordinates); // Destination
                  },
                  (error) => {
                    console.error('Error getting user location:', error);
                    alert('Unable to access your location. Please enable location services.');
                  }
                );
              } else {
                alert('Geolocation is not supported by your browser.');
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error loading GeoJSON:', error);
          setMapError('Failed to load GeoJSON data');
        });

      // Map load event
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
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
