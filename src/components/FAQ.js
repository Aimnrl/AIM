import React from 'react';
import './FAQ.css';
import { Link } from 'react-router-dom';

function FAQ() {
  return (
    <div className="faq-container">
      <header className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Helpful information for navigating the PSU Abington Campus</p>
      </header>

      <div style={{ textAlign: 'center', margin: '1rem 2rem' }}>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>


      <div className="faq-list">
        <div className="faq-item">
          <h2 className="question">📍 What are these QR Codes around campus? 📍</h2>
          <p className="answer">Scanning one of our QR codes will take you straight to our StreetView page for that floor of that building.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🏢 Where is Rydal Executive Plaza? 🏢</h2>
          <p className="answer"> The Rydal building and Rydal Executive Plaza are commonly mistaken for one another. 
            Rydal Executive Plaza is located at 1000 Old York Rd, by the train station. The Rydal building is located on the PSU Abington campus near the Woodland building.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">😡 Why are the StreetView Pictures Massive? 😡</h2>
          <p className="answer">AIM is made for mobile devices, so it might not look the same on desktop!</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🗺️ What is this app for? 🗺️</h2>
          <p className="answer">This app allows students and visitors to navigate campus buildings using QR codes that link to interactive floor maps.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🏫 Which building interiors are included? 🏫</h2>
          <p className="answer">Woodland, Sutherland, and Rydal buildings are currently supported, each with multiple floor views.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">❓ About AIM ❓</h2>
          <p className="answer">Abington Interactive Map (AIM) is a mobile-first interactive map application designed to assist new students at Penn State Abington in navigating the campus, specifically for classrooms and faculty offices.
                It was made for the CMPSC 487W Software Engineering course by Marco Isabella, Tao Geng, Marcos Ramirez, and Nirmal Nelson.
          </p>
        </div>

      </div>

      <footer className="faq-footer">
        <p>&copy; {new Date().getFullYear()} PSU Campus Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FAQ;
