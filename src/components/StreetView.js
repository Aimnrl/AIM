import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StreetView.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const StreetView = () => {
  const location = useLocation();

  // === Full buildingData object ===
  const buildingData = {
    Woodland: {
      floors: {
        '1': {
          floorPlan: '/images/Woodland-1.jpg',
          desc: 'Woodland 1st Floor Marked Floor Plan',
          exterior: [
            'images/211CANON/Woodland Pictures/Entrances/IMG_1130.JPG',
            'images/211CANON/Woodland Pictures/Entrances/IMG_1145.JPG',
          ],
          description: 'Woodland 1st Floor – labs and offices.',
          hallways: [
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1131.JPG', desc: 'Hallway left of library entrance' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1144.JPG', desc: 'Art Hallway from right side parking lot entrance' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1146.JPG', desc: 'Towards right side parking lot entrance' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1147.JPG', desc: 'Towards art hallway from overhang' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1148.JPG', desc: 'Under overhang towards art hallway' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1149.JPG', desc: 'Towards library entrance from overhang' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1155.JPG', desc: 'Library Stairs' },
          ],
        },
        '2': {
          floorPlan: '/images/Woodland-2.jpg',
          desc: 'Woodland 2nd Floor Marked Floor Plan',
          exterior: [
            'images/211CANON/Woodland Pictures/Entrances/IMG_1126.JPG',
          ],
          description: 'Woodland 2nd Floor – library and lounge.',
          hallways: [
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1128.JPG', desc: 'Hallway facing right of front entrance' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1129.JPG', desc: 'Further right of front entrance' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1134.JPG', desc: 'Chem Lab' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1150.JPG', desc: 'Right of stairs' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1152.JPG', desc: 'Further right of stairs' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1151.JPG', desc: 'Towards stairs from right' },
          ],
        },
        '3': {
          floorPlan: '/images/Woodland-3.jpg',
          desc: 'Woodland 3rd Floor Marked Floor Plan',
          description: 'Woodland 3rd Floor – staff offices.',
          hallways: [
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1133.JPG', desc: 'Student Lounge' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1135.JPG', desc: 'Chem Lab' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1136.JPG', desc: 'Left of stairs' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1137.JPG', desc: 'Right of stairs' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1139.JPG', desc: 'Towards stairs from right side' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1140.JPG', desc: 'CS Classes/IT' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1141.JPG', desc: 'Music Studio/Faculty Offices' },
            { img: '/images/211CANON/Woodland Pictures/Hallways/IMG_1142.JPG', desc: 'In front of IT' },
          ],
        },
      },
    },
    Sutherland: {
      floors: {
        B: {
          floorPlan: '/images/Sutherland-B.jpg',
          desc: 'Sutherland Basement Floor Marked Floor Plan',
          description: 'Sutherland Basement – stairs and utilities.',
          hallways: [
            { img: '/images/211CANON/Sutherland/Hallways/P4210208.JPG', desc: "Basement Stairs towards Men's Bathroom" },
          ],
        },
        '1': {
          floorPlan: '/images/Sutherland-1.jpg',
          desc: 'Sutherland 1st Floor Marked Floor Plan',
          exterior: 'images/211CANON/Sutherland/Entrances/P4210198.JPG',
          description: 'Sutherland 1st Floor – main lobby.',
          hallways: [
            { img: '/images/211CANON/Sutherland/Hallways/P4210199.JPG', desc: 'Faculty Offices' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210202.JPG', desc: 'Financial Aid' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210205.JPG', desc: 'Towards Basement Stairs from Entrance' },
          ],
        },
        '2': {
          floorPlan: '/images/Sutherland-2.jpg',
          desc: 'Sutherland 2nd Floor Marked Floor Plan',
          description: 'Sutherland 2nd Floor – classrooms.',
          hallways: [
            { img: '/images/211CANON/Sutherland/Hallways/P4210209.JPG', desc: 'Left hall from stairs' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210213.JPG', desc: 'Right hall from stairs' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210211.JPG', desc: '' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210212.JPG', desc: '' },
          ],
        },
        '3': {
          floorPlan: '/images/Sutherland-3.jpg',
          desc: 'Sutherland 3rd Floor Marked Floor Plan',
          description: 'Sutherland 3rd Floor – advanced labs.',
          hallways: [
            { img: '/images/211CANON/Sutherland/Hallways/P4210216.JPG', desc: 'Right hall from stairs' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210215.JPG', desc: 'Left hall from stairs' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210217.JPG', desc: '' },
            { img: '/images/211CANON/Sutherland/Hallways/P4210218.JPG', desc: '' },
          ],
        },
      },
    },
    Rydal: {
      floors: {
        '1': {
          floorPlan: '/images/Rydal-1.jpg',
          desc: 'Rydal 1st Floor Marked Floor Plan',
          exterior: 'images/211CANON/Rydal/Entrances/P4210191.JPG',
          description: 'Rydal 1st Floor – lounge area.',
          hallways: [],
        },
        '2': {
          floorPlan: '/images/Rydal-2.jpg',
          desc: 'Rydal 2nd Floor Marked Floor Plan',
          description: 'Rydal 2nd Floor – offices, smaller labs.',
          hallways: [
            { img: '/images/211CANON/Rydal/Hallway/P4210195.JPG', desc: '' },
            { img: '/images/211CANON/Rydal/Hallway/P4210196.JPG', desc: '' },
            { img: '/images/211CANON/Rydal/Hallway/P4210197.JPG', desc: '' },
          ],
        },
      },
    },
  };

  // Helpers for building and floor keys
  const buildingNames = Object.keys(buildingData);
  const defaultBuilding = buildingData.Woodland ? 'Woodland' : buildingNames[0];
  const defaultFloors = Object.keys(buildingData[defaultBuilding]?.floors || {});

  // State hooks
  const [loading, setLoading] = useState(true);
  const [currentBuilding, setCurrentBuilding] = useState(defaultBuilding);
  const [currentFloor, setCurrentFloor] = useState(defaultFloors[0] || '');
  const [viewType, setViewType] = useState('exterior');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  // Recompute floors whenever building changes, safely
  const availableFloors = Object.keys(buildingData[currentBuilding]?.floors || {});

  // On URL change, set building from ?building=
  useEffect(() => {
    setLoading(true);
    setCurrentIndex(0);

    const params = new URLSearchParams(location.search);
    const buildingParam = params.get('building');
    if (buildingParam && buildingNames.includes(buildingParam)) {
      setCurrentBuilding(buildingParam);
    }

    setTimeout(() => setLoading(false), 400);
  }, [location, buildingNames]);

  // When building or URL changes, set floor from ?floor=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const floorParam = params.get('floor');
    if (floorParam && availableFloors.includes(floorParam)) {
      setCurrentFloor(floorParam);
    } else if (!availableFloors.includes(currentFloor)) {
      setCurrentFloor(availableFloors[0] || '');
    }
  }, [currentBuilding, location, availableFloors, currentFloor]);

  // Pick an image whenever building/floor/viewType change
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (viewType === 'floorplan') {
      setCurrentImage(
        buildingData[currentBuilding].floors[currentFloor].floorPlan || null
      );
    } else if (viewType !== 'exterior') {
      const arr =
        buildingData[currentBuilding].floors[currentFloor][viewType] || [];
      setCurrentImage(arr.length > 0 ? arr[0].img : null);
    } else {
      // exterior view handled in JSX
      setCurrentImage(null);
    }
  }, [currentBuilding, currentFloor, viewType]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const getCurrentDescription = () => {
    if (viewType === 'exterior') {
      return (
        buildingData[currentBuilding].floors[currentFloor].description || ''
      );
    } else if (viewType === 'floorplan') {
      return (
        buildingData[currentBuilding].floors[currentFloor].desc || ''
      );
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
                  setCurrentFloor(
                    Object.keys(buildingData[bName].floors)[0]
                  );
                  setViewType('floorplan');
                }}
                className={
                  currentBuilding === bName ? 'active' : ''
                }
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
                if (a === 'B') return -1;
                if (b === 'B') return 1;
                return parseInt(a) - parseInt(b);
              })
              .map((fNum) => (
                <button
                  key={fNum}
                  onClick={() => {
                    setCurrentFloor(fNum);
                    setViewType('floorplan');
                  }}
                  className={
                    currentFloor === fNum ? 'active' : ''
                  }
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
              className={
                viewType === 'floorplan' ? 'active' : ''
              }
            >
              Floor Plan
            </button>
            <button
              onClick={() => {
                if (hasEntrances) setViewType('exterior');
              }}
              disabled={!hasEntrances}
              className={
                viewType === 'exterior' ? 'active' : ''
              }
            >
              Entrances
            </button>
            <button
              onClick={() => setViewType('hallways')}
              disabled={!hasHallways}
              className={
                viewType === 'hallways' ? 'active' : ''
              }
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
            {Array.isArray(
              buildingData[currentBuilding].floors[currentFloor]
                .exterior
            ) ? (
              buildingData[
                currentBuilding
              ].floors[currentFloor].exterior.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Entrance ${idx + 1}`}
                  className="location-image"
                />
              ))
            ) : (
              <img
                src={
                  buildingData[currentBuilding].floors[
                    currentFloor
                  ].exterior
                }
                alt="Entrance"
                className="location-image"
              />
            )}
          </div>
        ) : viewType === 'hallways' ? (
          <div className="hallways-container">
            {buildingData[currentBuilding].floors[
              currentFloor
            ].hallways.length > 0 ? (
              buildingData[
                currentBuilding
              ].floors[currentFloor].hallways.map(
                (hallway, index) => (
                  <div
                    key={index}
                    className="hallway-image"
                  >
                    <img
                      src={hallway.img}
                      alt={hallway.desc}
                    />
                    <p>{hallway.desc}</p>
                  </div>
                )
              )
            ) : (
              <p>No hallway images available</p>
            )}
          </div>
        ) : currentImage ? (
          <div className="image-navigation">
            <button
              className="nav-button prev"
              onClick={() =>
                navigateImages('prev')
              }
            >
              ‹
            </button>
            <TransformWrapper>
              <TransformComponent>
                <img
                  src={currentImage}
                  alt={`${currentBuilding} Floor ${currentFloor} - ${viewType}`}
                  className="location-image"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml;base64,...';
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
            <button
              className="nav-button next"
              onClick={() =>
                navigateImages('next')
              }
            >
              ›
            </button>
            <p className="image-desc">
              {getCurrentDescription()}
            </p>
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