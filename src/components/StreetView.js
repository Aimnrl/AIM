// src/components/StreetView.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StreetView.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const StreetView = () => {
  const [loading, setLoading] = useState(true);
  const [currentBuilding, setCurrentBuilding] = useState('Woodland'); // default building
  const [currentFloor, setCurrentFloor] = useState('1'); // default floor
  const [viewType, setViewType] = useState('exterior');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  const location = useLocation();

  // Data separated by building and floors
  const buildingData = {
    Woodland: {
      floors: {
        '1': {
          floorPlan: '/images/Woodland-1.jpg', desc: 'Woodland 1st Floor Marked Floor Plan',
          exterior: [
            'images/211CANON/Woodland Pictures/Entrances/IMG_1130.JPG',
            'images/211CANON/Woodland Pictures/Entrances/IMG_1145.JPG',
          ],
          description: 'Woodland 1st Floor – labs and offices.',
          /*hallways: [
            { img: '/images/Woodland-1.jpg', desc: 'Hallway near front entrance' },
          ],*/
        },
        '2': {
          floorPlan: '/images/Woodland-2.jpg', desc: 'Woodland 2nd Floor Marked Floor Plan',
          exterior: [
            'images/211CANON/Woodland Pictures/Entrances/IMG_1126.JPG',
          ],
          description: 'Woodland 2nd Floor – library and lounge.',
          hallways: [],
        },
        '3': {
          floorPlan: '/images/Woodland-3.jpg', desc: 'Woodland 3rd Floor Marked Floor Plan',
          description: 'Woodland 3rd Floor – staff offices.',
          hallways: [],
        },
      },
    },
    Sutherland: {
      floors: {
        'B': {
          floorPlan: '/images/Sutherland-B.jpg', desc: 'Sutherland Basement Floor Marked Floor Plan',
          description: 'Sutherland 1st Floor – main lobby.',
          hallways: [],
        },
        '1': {
          floorPlan: '/images/Sutherland-1.jpg', desc: 'Sutherland 1st Floor Marked Floor Plan',
          exterior: 'images/211CANON/Sutherland/Entrances/P4210198.JPG',
          description: 'Sutherland 1st Floor – main lobby.',
          hallways: [],
        },
        '2': {
          floorPlan: '/images/Sutherland-2.jpg', desc: 'Sutherland 2nd Floor Marked Floor Plan',
          description: 'Sutherland 2nd Floor – classrooms.',
          hallways: [],
        },
        '3': {
          floorPlan: '/images/Sutherland-3.jpg', desc: 'Sutherland 3rd Floor Marked Floor Plan',
          description: 'Sutherland 3rd Floor – advanced labs.',
          hallways: [],
        },
      },
    },
    Rydal: {
      floors: {
        '1': {
          floorPlan: '/images/Rydal-1.jpg', desc: 'Rydal 1st Floor Marked Floor Plan',
          exterior: 'images/211CANON/Rydal/Entrances/P4210191.JPG',
          description: 'Rydal 1st Floor – lounge area.',
          hallways: [],
        },
        '2': {
          floorPlan: '/images/Rydal-2.jpg', desc: 'Rydal 2nd Floor Marked Floor Plan',
          description: 'Rydal 2nd Floor – offices, smaller labs.',
          hallways: [],
        },
      },
    },
  };

  // A helper to see what buildings exist as keys
  const buildingNames = Object.keys(buildingData); // e.g. ["Woodland", "Sutherland", "Rydal"]
  // The floors for the selected building
  const availableFloors = Object.keys(buildingData[currentBuilding].floors); // e.g. ["1","2","3"]

  // Read ?building= and ?floor= from URL on initial load
  useEffect(() => {
    setLoading(true);
    setCurrentIndex(0);

    const params = new URLSearchParams(location.search);
    const buildingParam = params.get('building'); // e.g. "Woodland"
    const floorParam = params.get('floor');       // e.g. "2"

    // If buildingParam is one of buildingNames, set it
    if (buildingParam && buildingNames.includes(buildingParam)) {
      setCurrentBuilding(buildingParam);
    }
    // After setting the building, we recalc floors below or in a separate effect

    // If floorParam is in that building's floors, set it
    // We'll do it after we know the building
    // We'll do a small timeout or immediate check in another effect

    // We'll set up an immediate
    setTimeout(() => setLoading(false), 400);
  }, [location]);

  // After building changes, also try to set the floor from the URL param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const floorParam = params.get('floor');
    // If the user typed /streetview?building=Woodland&floor=3 and "3" is valid
    // we set currentFloor to "3"
    if (floorParam && availableFloors.includes(floorParam)) {
      setCurrentFloor(floorParam);
    } else {
      // Otherwise, we might just default to "1" (or do nothing)
      if (!availableFloors.includes(currentFloor)) {
        // If the existing currentFloor is not valid for the new building, reset it
        setCurrentFloor(availableFloors[0]);
      }
    }
  }, [currentBuilding, location, availableFloors]);

  // Each time building/floor/viewType changes, pick an image
  useEffect(() => {
    if (viewType === 'floorplan') {
      setCurrentImage(buildingData[currentBuilding].floors[currentFloor].floorPlan || null);
    } else if (viewType !== 'exterior') {
      const arr = buildingData[currentBuilding].floors[currentFloor][viewType];
      if (arr && arr.length > 0) {
        setCurrentImage(arr[0].img);
      } else {
        setCurrentImage(null);
      }
    } else {
      // exterior case is now handled in render
      setCurrentImage(null);
    }
  }, [currentBuilding, currentFloor, viewType]);
  
  
const getCurrentDescription = () => {
  if (viewType === 'exterior') {
    return (
      buildingData[currentBuilding].floors[currentFloor].description || ''
    );
  } else if (viewType === 'floorplan') {
    return (
      buildingData[currentBuilding].floors[currentFloor].desc || 'Floor plan'
    );
  } else {
    const arr =
      buildingData[currentBuilding].floors[currentFloor][viewType] || [];
    if (arr.length > 0) {
      return arr[currentIndex].desc;
    }
    return '';
  }
};


const navigateImages = (direction) => {
  const data = buildingData[currentBuilding].floors[currentFloor];

  let arr = [];

  if (viewType === 'exterior') {
    const ext = data.exterior;
    if (Array.isArray(ext)) arr = ext.map((img) => ({ img }));
    else return; // single image, no navigation
  } else {
    arr = data[viewType] || [];
  }

  if (arr.length <= 1) return;

  setLoading(true);
  let newIndex = direction === 'next'
    ? (currentIndex + 1) % arr.length
    : currentIndex === 0
    ? arr.length - 1
    : currentIndex - 1;

  setCurrentIndex(newIndex);
  setCurrentImage(arr[newIndex].img || arr[newIndex]);

  setTimeout(() => setLoading(false), 400);
};

// Helper to check if current floor has entrance images
const hasEntrances = (() => {
  const exteriorData = buildingData[currentBuilding].floors[currentFloor].exterior;
  return exteriorData && (
    Array.isArray(exteriorData) ? exteriorData.length > 0 : true
  );
})();

  return (
    <div className="street-view-container">
      <div className="street-view-header">
        <h1>
          {currentBuilding} – Floor {currentFloor}
        </h1>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>

      <div className="controls-panel">
        {/* Building Selector */}
        <div className="building-selector">
          <label>Building:</label>
          <div className="button-group">
            {buildingNames.map((bName) => (
              <button
                key={bName}
                onClick={() => {
                  setCurrentBuilding(bName);
                  const hasExterior = buildingData[bName].floors['1']?.exterior;
                  setViewType(hasExterior ? 'exterior' : 'floorplan');
                }}                
                className={currentBuilding === bName ? 'active' : ''}
              >
                {bName}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Selector */}
        <div className="floor-selector">
          <label>Floor:</label>
          <div className="button-group">
          {[...availableFloors]
            .sort((a, b) => {
              if (a === 'B') return -1; // Always place "B" at the top
              if (b === 'B') return 1;
              return parseInt(a) - parseInt(b); // Then sort "1", "2", "3" numerically
            })
            .map((fNum) => (

              <button
                key={fNum}
                onClick={() => {
                  setCurrentFloor(fNum);
                  const hasExterior = buildingData[currentBuilding].floors[fNum]?.exterior;
                  setViewType(hasExterior ? 'exterior' : 'floorplan');
                }}                
                className={currentFloor === fNum ? 'active' : ''}
              >
                {fNum}
              </button>
            ))}
          </div>
        </div>

        {/* View Type Selector */}
        <div className="view-selector">
        <label>View Type:</label>
        <div className="button-group">
          <button
            onClick={() => setViewType('floorplan')}
            className={viewType === 'floorplan' ? 'active' : ''}
          >
            Floor Plan
          </button>
          <button
            onClick={() => {
              if (hasEntrances) setViewType('exterior');
            }}
            disabled={!hasEntrances}
            className={viewType === 'exterior' ? 'active' : ''}
          >
            Entrances
          </button>
          <button
            onClick={() => setViewType('hallways')}
            className={viewType === 'hallways' ? 'active' : ''}
          >
            Hallways
          </button>
        </div>
      </div>
        <Link to="/map" className="map-link">
          Return to Campus Map
        </Link>
      </div>

      <div className="viewer-container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading view...</p>
          </div>
        )}

{viewType === 'exterior' ? (
  <div className="multi-image-scroll">
    {Array.isArray(buildingData[currentBuilding].floors[currentFloor].exterior) ? (
      buildingData[currentBuilding].floors[currentFloor].exterior.map((imgSrc, idx) => (
        <img
          key={idx}
          src={imgSrc}
          alt={`Entrance ${idx + 1}`}
          className="location-image"
        />
      ))
    ) : (
      <img
        src={buildingData[currentBuilding].floors[currentFloor].exterior}
        alt="Entrance"
        className="location-image"
      />
    )}
  </div>
) : currentImage ? (
  <div className="image-navigation">
    <TransformWrapper>
  <TransformComponent>
    <img
      src={currentImage}
      alt={`${currentBuilding} Floor ${currentFloor} - ${viewType}`}
      className="location-image"
      onError={(e) => {
        e.target.src =
          'data:image/svg+xml;base64,...'; // your fallback image
      }}
    />
  </TransformComponent>
</TransformWrapper>

  </div>
) : (
  <div className="no-images-section">
    <p>No images yet.</p>
  </div>
)}


      </div>

      <div className="street-view-footer">
        <p>
          PSU Abington Campus Navigator |{' '}
          <a href="#" className="footer-link">Report an issue</a>
        </p>
      </div>
    </div>
  );
};

export default StreetView;
