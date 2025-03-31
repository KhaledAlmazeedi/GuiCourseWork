import React, { useState } from 'react';
import WeatherHome from './WeatherHome'; // Main WeatherHome component
import TodaysWeather from './TodaysWeather'; // Component to display today's weather
import CheckDemand from './CheckDemand'; // Component to check demand
import More from './More'; // Component for additional features
import './App.css'; // Styling for the app

const App = () => {
  // State to store the selected city, default is 'Mile End'
  const [city, setCity] = useState('Mile End');

  // State to toggle the visibility of the TodaysWeather component
  const [showTodaysWeather, setShowTodaysWeather] = useState(false);

  // State to toggle the visibility of the CheckDemand component
  const [showCheckDemand, setShowCheckDemand] = useState(false);

  // State to toggle the visibility of the More component
  const [showMore, setShowMore] = useState(false);

  // Function to handle city change, updates the city state
  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  return (
    <div className="App">
      <h1>Weather App</h1>

      {/* Conditional rendering based on the state to show different components */}
      {showTodaysWeather ? (
        // Show TodaysWeather component if showTodaysWeather is true
        <TodaysWeather
          city={city} // Pass the current city as a prop
          onShowWeatherHome={() => setShowTodaysWeather(false)} // Callback to go back to WeatherHome
          onCityChange={handleCityChange} // Callback to handle city change
        />
      ) : showCheckDemand ? (
        // Show CheckDemand component if showCheckDemand is true
        <CheckDemand
          city={city} // Pass the current city as a prop
          onBack={() => setShowCheckDemand(false)} // Callback to go back to WeatherHome
        />
      ) : showMore ? (
        // Show More component if showMore is true
        <More
          city={city} // Pass the current city as a prop
          onBack={() => setShowMore(false)} // Callback to go back to WeatherHome
        />
      ) : (
        // Default view: Show the main WeatherHome component
        <WeatherHome
          city={city} // Pass the current city as a prop
          onCityChange={handleCityChange} // Callback to handle city change
          onShowTodaysWeather={() => setShowTodaysWeather(true)} // Callback to navigate to TodaysWeather
          onShowCheckDemand={() => setShowCheckDemand(true)} // Callback to navigate to CheckDemand
          onShowMore={() => setShowMore(true)} // Callback to navigate to More
        />
      )}
    </div>
  );
};

export default App;
