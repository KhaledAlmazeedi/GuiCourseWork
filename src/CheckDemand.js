import React from 'react';
import './CheckDemand.css'; // Importing the CSS file for styling
import londonMap from './Londonmap.png'; // Importing the static map image

// Functional component to display demand information
const CheckDemand = ({onBack, city}) => {
  return (
    <div className="demand-page">
      {/* Container for the map */}
      <div className="map-container">
        <img src={londonMap} alt="London Map" className="map-image" />
      </div>

      {/* Information panel displaying demand details */}
      <div className="info-panel">
        <p><strong>Area with highest demand:</strong> Stratford</p> {/* Displaying the area with the highest demand */}
        <p><strong>Current Waiting Time:</strong> 5 mins</p> {/* Displaying the current waiting time */}
        <p><strong>Weather Alert:</strong> Heavy rain expected</p> {/* Displaying a weather alert */}
        <p><strong>Surge Pricing Active:</strong> Earn 2x in Stratford</p> {/* Displaying surge pricing information */}
        <button className="back-button" onClick={onBack}>Back</button> {/* Back button to navigate to the previous page */}
      </div>
    </div>
  );
};

export default CheckDemand; // Exporting the component for use in other parts of the application
