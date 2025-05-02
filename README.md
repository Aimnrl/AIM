# PSU Campus Navigator

PSU Campus Navigator is a React-based web application designed to help students and visitors navigate the Penn State Abington campus. The app provides interactive maps, QR code-based navigation, and StreetView functionality for various campus buildings and floors.

## Features

- **Interactive Map**: View the PSU Abington campus map with building markers and directions using Mapbox.
- **QR Code Navigation**: Scan QR codes to access floor-specific maps and StreetView.
- **StreetView**: Explore building interiors and hallways with zoom and pan functionality.
- **Responsive Design**: Optimized for mobile devices but also functional on desktops.
- **FAQ Section**: Provides helpful information about the app and campus navigation.

## Project Structure

```
psu-campus-navigator/
├── public/                # Static files like index.html and icons
├── src/                   # React components and assets
│   ├── components/        # Reusable components
│   ├── pages/             # Main pages of the app
│   ├── utils/             # Utility functions
│   └── App.js             # Main application component
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/psu-campus-navigator.git
   cd psu-campus-navigator

2. Install dependencies
<code>npm install</code>

3. Start the development server:
<code>npm start</code>

The app will be available at http://localhost:3000.

Usage:
Interactive Map: Navigate to /map to view the campus map. Click on building markers to get directions.
QR Code List: Visit /floors to select a floor and view its QR code.
StreetView: Navigate to /streetview to explore building interiors and hallways.
FAQ: Visit /faq for answers to common questions.

Dependencies:
React
React Router
Mapbox GL JS
QRCode.react
React Zoom Pan Pinch

Environment Variables:
To use Mapbox, you need an access token. Replace the placeholder token in Map.js with <code>mapboxgl.accessToken = 'your-mapbox-access-token';</code>

Authors:
Marco Isabella
Tao Geng
Marcos Ramirez
Nirmal Nelson

Developed as part of the CMPSC 487W Software Engineering course at Penn State Abington.