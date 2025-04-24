// src/components/StreetView.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './StreetView.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const StreetView = () => {
  const location = useLocation();

  // === full buildingData object (unchanged) ===
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
        'B': {
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

  // Get all building names
  const buildingNames = Object.keys(buildingData);

  // Determine a safe default building and floor
  const defaultBuilding = buildingData.Woodland ? 'Woodland' : buildingNames[0];
  const defaultFloors   = Object.keys(buildingData[defaultBuilding]?.floors || {});

  // State hooks
  const [loading, setLoading]           = useState(true);
  const [currentBuilding, setCurrentBuilding] = useState(defaultBuilding);
  const [currentFloor, setCurrentFloor]       = useState(defaultFloors[0] || '');
  const [viewType, setViewType]         = useState('exterior');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  // Recompute availableFloors safely whenever building changes
  const availableFloors = Object.keys(
    buildingData[currentBuilding]?.floors || {}
  );

  // Read ?building from URL on initial load
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

  // After building changes, pick up ?floor if valid
  useEffect(() => {
    const params     = new URLSearchParams(location.search);
    const floorParam = params.get('floor');

    if (floorParam && availableFloors.includes(floorParam)) {
      setCurrentFloor(floorParam);
    } else if (!availableFloors.includes(currentFloor)) {
      setCurrentFloor(availableFloors[0] || '');
    }
  }, [currentBuilding, location, availableFloors, currentFloor]);

  // Each time building/floor/viewType changes, pick an image
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (viewType === 'floorplan') {
      setCurrentImage(buildingData[currentBuilding].floors[currentFloor].floorPlan || null);
    } else if (viewType !== 'exterior') {
      const arr = buildingData[currentBuilding].floors[currentFloor][viewType] || [];
      setCurrentImage(arr.length > 0 ? arr[0].img : null);
    } else {
      setCurrentImage(null);
    }
  }, [currentBuilding, currentFloor, viewType]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Helper functions and rendering logic stay the same...
  // [ ... rest of your component code unchanged ... ]

  return (
    <div className="street-view-container">
      {/* ... your existing JSX ... */}
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