import React, { useState } from 'react';
import WeatherHome from './WeatherHome'; // Your WeatherHome component
import TodaysWeather from './TodaysWeather'; // The TodaysWeather component
import './App.css'; // Ensure you have this file for styling

const App = () => {
  const [city, setCity] = useState('Mile End'); // Default city
  const [showTodaysWeather, setShowTodaysWeather] = useState(false); // State to toggle components

  // Function to handle city change
  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      {showTodaysWeather ? (
        <TodaysWeather
          city={city}
          onShowWeatherHome={() => setShowTodaysWeather(false)} // Switch back to WeatherHome component
          onCityChange={handleCityChange} // Pass city change handler
        />
      ) : (
        <WeatherHome
          city={city}
          onShowTodaysWeather={() => setShowTodaysWeather(true)} // Switch to TodaysWeather component
          onCityChange={handleCityChange} // Pass city change handler
        />
      )}
    </div>
  );
};

export default App;