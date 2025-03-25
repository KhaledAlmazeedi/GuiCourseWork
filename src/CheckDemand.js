import React from 'react';
import './CheckDemand.css';
import londonMap from './Londonmap.png'; // Your static map image

const CheckDemand = ({onBack, city}) => {
  return (
    <div className="demand-page">
      <div className="map-container">
        <img src={londonMap} alt="London Map" className="map-image" />
        </div>

      <div className="info-panel">
        <p><strong>Area with highest demand:</strong> Stratford</p>
        <p><strong>Current Waiting Time:</strong> 5 mins</p>
        <p><strong>Weather Alert:</strong> Heavy rain expected</p>
        <p><strong>Surge Pricing Active:</strong> Earn 2x in Stratford</p>
        <button className="back-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
};

export default CheckDemand;
