import React from 'react';
import './CheckDemand.css';
import londonMap from './Londonmap.png';

const CheckDemand = ({ onBack, city }) => {
  return (
    <div className="demand-page">
      <div className="map-container">
        <img src={londonMap} alt={`${city} Map`} className="map-image" />
        <div className="map-overlay">{city} Demand Map</div>
      </div>

      <div className="info-panel">
        <h3>Demand Information</h3>
        
        <div className="info-item">
          <span className="info-label">Highest Demand Area:</span>
          <span className="info-value">Stratford</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Current Waiting Time:</span>
          <span className="info-value">5 mins</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Weather Alert:</span>
          <span className="info-value alert">Heavy rain expected</span>
        </div>
        
        <div className="info-item highlight">
          <span className="info-label">Surge Pricing:</span>
          <span className="info-value">2x in Stratford</span>
        </div>

        <button className="back-button" onClick={onBack}>Back to Weather</button>
      </div>
    </div>
  );
};

export default CheckDemand;