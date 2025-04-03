import React from 'react';
import './CheckDemand.css'; // Importing the CSS file for styling
import londonMap from './Londonmap.png'; // Importing the map image

// Functional component to display demand information for a city
const CheckDemand = ({ onBack, city }) => {
  return (
    <div className="demand-page">
      {/* Container for the map */}
      <div className="map-container">
        {/* Displaying the map image */}
        <img src={londonMap} alt={`${city} Map`} className="map-image" />
        {/* Overlay text on the map */}
        <div className="map-overlay">{city} Demand Map</div>
      </div>

      {/* Panel to display demand-related information */}
      <div className="info-panel">
        <h3>Demand Information</h3>
        
        {/* Displaying the highest demand area */}
        <div className="info-item">
          <span className="info-label">Highest Demand Area:</span>
          <span className="info-value">Stratford</span>
        </div>
        
        {/* Displaying the current waiting time */}
        <div className="info-item">
          <span className="info-label">Current Waiting Time:</span>
          <span className="info-value">5 mins</span>
        </div>
        
        {/* Displaying a weather alert */}
        <div className="info-item">
          <span className="info-label">Weather Alert:</span>
          <span className="info-value alert">Heavy rain expected</span>
        </div>
        
        {/* Highlighted section for surge pricing information */}
        <div className="info-item highlight">
          <span className="info-label">Surge Pricing:</span>
          <span className="info-value">2x in Stratford</span>
        </div>

        {/* Button to navigate back to the weather page */}
        <button className="back-button" onClick={onBack}>Back to Weather</button>
      </div>
    </div>
  );
};

export default CheckDemand; // Exporting the component for use in other parts of the application