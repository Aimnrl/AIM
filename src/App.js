// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Map from "./components/Map";
import StreetView from "./components/StreetView";
import QrCodeList from "./components/QrCodeList";
import FloorQrCode from "./components/FloorQrCode";
import FAQ from './components/FAQ';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/streetview" element={<StreetView />} />
          
          {/* Floors listing and individual floor page */}
          <Route path="/floors" element={<QrCodeList />} />
          <Route path="/floors/:floorParam" element={<FloorQrCode />} />

          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/faq" element={<FAQ />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
