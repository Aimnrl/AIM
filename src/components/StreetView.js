// src/components/StreetView.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StreetView.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const StreetView = () => {
  const [loading, setLoading] = useState(true);
  const [currentBuilding, setCurrentBuilding] = useState('Woodland'); // default building
  const [currentFloor, setCurrentFloor] = useState('1');              // default floor
  const [viewType, setViewType] = useState('exterior');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  const location = useLocation();

  // Data separated by building and floors
  const buildingData = {
    // … (your buildingData object as before) …
  };

  const buildingNames   = Object.keys(buildingData);
  const availableFloors = Object.keys(buildingData[currentBuilding].floors);

  // Read ?building= from URL on initial load
  useEffect(() => {
    setLoading(true);
    setCurrentIndex(0);

    const params        = new URLSearchParams(location.search);
    const buildingParam = params.get('building');

    if (buildingParam && buildingNames.includes(buildingParam)) {
      setCurrentBuilding(buildingParam);
    }

    setTimeout(() => setLoading(false), 400);
  }, [location, buildingNames]);

  // After building changes, pick up floor from URL if valid
  useEffect(() => {
    const params     = new URLSearchParams(location.search);
    const floorParam = params.get('floor');

    if (floorParam && availableFloors.includes(floorParam)) {
      setCurrentFloor(floorParam);
    } else if (!availableFloors.includes(currentFloor)) {
      setCurrentFloor(availableFloors[0]);
    }
  }, [currentBuilding, location, availableFloors, currentFloor]);

  // Each time building/floor/viewType changes, pick an image
  // Suppress exhaustive-deps since buildingData is a static literal here
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (viewType === 'floorplan') {
      setCurrentImage(
        buildingData[currentBuilding].floors[currentFloor].floorPlan ||
          null
      );
    } else if (viewType !== 'exterior') {
      const arr =
        buildingData[currentBuilding].floors[currentFloor][viewType] || [];
      setCurrentImage(arr.length > 0 ? arr[0].img : null);
    } else {
      setCurrentImage(null);
    }
  }, [currentBuilding, currentFloor, viewType]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const getCurrentDescription = () => {
    if (viewType === 'exterior') {
      return buildingData[currentBuilding].floors[currentFloor].description || '';
    } else if (viewType === 'floorplan') {
      return buildingData[currentBuilding].floors[currentFloor].desc || '';
    }
    const arr =
      buildingData[currentBuilding].floors[currentFloor][viewType] || [];
    return arr.length > 0 ? arr[currentIndex].desc : '';
  };

  const navigateImages = (direction) => {
    const data = buildingData[currentBuilding].floors[currentFloor];
    let arr = [];

    if (viewType === 'exterior') {
      const ext = data.exterior;
      arr = Array.isArray(ext) ? ext.map((img) => ({ img })) : [];
    } else {
      arr = data[viewType] || [];
    }

    if (arr.length <= 1) return;

    setLoading(true);
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % arr.length
        : currentIndex === 0
        ? arr.length - 1
        : currentIndex - 1;

    setCurrentIndex(newIndex);
    setCurrentImage(arr[newIndex].img || arr[newIndex]);

    setTimeout(() => setLoading(false), 400);
  };

  const hasEntrances = (() => {
    const ext = buildingData[currentBuilding].floors[currentFloor].exterior;
    return Array.isArray(ext) ? ext.length > 0 : !!ext;
  })();

  const hasHallways = (() => {
    const h = buildingData[currentBuilding].floors[currentFloor].hallways;
    return Array.isArray(h) && h.length > 0;
  })();

  return (
    <div className="street-view-container">
      <div className="street-view-header">
        <h1>
          {currentBuilding} – Floor {currentFloor}
        </h1>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>

      {/* … your controls panel & viewer code unchanged … */}

      <div className="street-view-footer">
        <p>
          PSU Abington Campus Navigator |{' '}
          <a
            href="https://github.com/your-org/your-repo/issues"
            target="_blank"
            rel="noopener"
            className="footer-link"
          >
            Report an issue
          </a>
        </p>
      </div>
    </div>
  );
};

export default StreetView;
