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
          <h2 className="question">📍 How do I scan a QR code?</h2>
          <p className="answer">Open your phone’s camera or a QR scanner app and point it at the QR code. It should open the map for that floor automatically.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🏢 Where is Rydal Executive Plaza?</h2>
          <p className="answer"> The Rydal building and Rydal Executive Plaza are commonly mistaken for one another. 
            Rydal Executive Plaza is located at 1000 Old York Rd, by the train station. The Rydal building is located on the PSU Abington campus near the Woodland building.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🗺️ What is this app for?</h2>
          <p className="answer">This app allows students and visitors to navigate campus buildings using QR codes that link to interactive floor maps.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">🏫 Which buildings are included?</h2>
          <p className="answer">Woodland, Sutherland, and Rydal buildings are currently supported, each with multiple floor views.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">📶 Do I need internet?</h2>
          <p className="answer">Yes, a stable internet connection is needed to view the maps after scanning a QR code.</p>
        </div>

        <div className="faq-item">
          <h2 className="question">📞 Who do I contact for help?</h2>
          <p className="answer">You can contact PSU Abington IT support or your building's front desk for more information or help navigating the system.</p>
        </div>
      </div>

      <footer className="faq-footer">
        <p>&copy; {new Date().getFullYear()} PSU Campus Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FAQ;
