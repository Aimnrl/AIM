// src/components/StreetView.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StreetView.css';

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
          exterior: '/images/woodland-1st-exterior.jpg',
          description: 'Woodland 1st Floor – labs and offices.',
          hallways: [
            { img: '/images/woodland-1st-hallway1.jpg', desc: 'Hallway near front entrance' },
          ],
          stairs: [],
          entrances: [],
        },
        '2': {
          exterior: '/images/woodland-2nd-exterior.jpg',
          description: 'Woodland 2nd Floor – library and lounge.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
        '3': {
          exterior: '/images/woodland-3rd-exterior.jpg',
          description: 'Woodland 3rd Floor – staff offices.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
      },
    },
    Sutherland: {
      floors: {
        '1': {
          exterior: '/images/sutherland-1st-exterior.jpg',
          description: 'Sutherland 1st Floor – main lobby.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
        '2': {
          exterior: '/images/sutherland-2nd-exterior.jpg',
          description: 'Sutherland 2nd Floor – classrooms.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
        '3': {
          exterior: '/images/sutherland-3rd-exterior.jpg',
          description: 'Sutherland 3rd Floor – advanced labs.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
      },
    },
    Rydal: {
      floors: {
        '1': {
          exterior: '/images/rydal-1st-exterior.jpg',
          description: 'Rydal 1st Floor – lounge area.',
          hallways: [],
          stairs: [],
          entrances: [],
        },
        '2': {
          exterior: '/images/rydal-2nd-exterior.jpg',
          description: 'Rydal 2nd Floor – offices, smaller labs.',
          hallways: [],
          stairs: [],
          entrances: [],
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
    // If "exterior", just pick the exterior
    if (viewType === 'exterior') {
      setCurrentImage(
        buildingData[currentBuilding].floors[currentFloor].exterior || null
      );
    } else {
      // e.g. hallways, stairs, entrances
      const arr = buildingData[currentBuilding].floors[currentFloor][viewType];
      if (arr && arr.length > 0) {
        setCurrentImage(arr[0].img);
      } else {
        setCurrentImage(null);
      }
    }
  }, [currentBuilding, currentFloor, viewType]);

  const getCurrentDescription = () => {
    if (viewType === 'exterior') {
      return (
        buildingData[currentBuilding].floors[currentFloor].description || ''
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
    if (viewType === 'exterior') return;
    const arr =
      buildingData[currentBuilding].floors[currentFloor][viewType] || [];
    if (arr.length <= 1) return;

    setLoading(true);
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % arr.length;
    } else {
      newIndex = currentIndex === 0 ? arr.length - 1 : currentIndex - 1;
    }
    setCurrentIndex(newIndex);
    setCurrentImage(arr[newIndex].img);

    setTimeout(() => setLoading(false), 400);
  };

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
                  setViewType('exterior'); // optional: reset to exterior
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
            {availableFloors.map((fNum) => (
              <button
                key={fNum}
                onClick={() => {
                  setCurrentFloor(fNum);
                  setViewType('exterior');
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
              onClick={() => setViewType('exterior')}
              className={viewType === 'exterior' ? 'active' : ''}
            >
              Exterior
            </button>
            <button
              onClick={() => setViewType('hallways')}
              className={viewType === 'hallways' ? 'active' : ''}
            >
              Hallways
            </button>
            <button
              onClick={() => setViewType('stairs')}
              className={viewType === 'stairs' ? 'active' : ''}
            >
              Stairs
            </button>
            <button
              onClick={() => setViewType('entrances')}
              className={viewType === 'entrances' ? 'active' : ''}
            >
              Entrances
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

        <div className="image-container">
          {/* If currentImage is null, show "No images yet" */}
          {currentImage ? (
            <div className="image-navigation">
              {(viewType !== 'exterior' &&
                (buildingData[currentBuilding].floors[currentFloor][viewType]
                  ?.length || 0) > 1) && (
                <button
                  className="nav-button prev"
                  onClick={() => navigateImages('prev')}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
              )}

              <img
                src={currentImage}
                alt={`${currentBuilding} Floor ${currentFloor} - ${viewType}`}
                className="location-image"
                onError={(e) => {
                  // fallback placeholder if image fails
                  e.target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNvbnRlbnQgeD0iMCIgeT0iMCIgIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjBmMGYwIi8+PGV0Yy8+PC9zdmc+';
                }}
              />

              {(viewType !== 'exterior' &&
                (buildingData[currentBuilding].floors[currentFloor][viewType]
                  ?.length || 0) > 1) && (
                <button
                  className="nav-button next"
                  onClick={() => navigateImages('next')}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              )}
            </div>
          ) : (
            <div className="no-images-section">
              <p>No images yet.</p>
            </div>
          )}

          <div className="image-description">
            <h3>
              {currentBuilding} – Floor {currentFloor} ({viewType})
            </h3>
            <p>{getCurrentDescription()}</p>
          </div>
        </div>
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
