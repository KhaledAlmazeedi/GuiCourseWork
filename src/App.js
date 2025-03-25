import React, { useState } from 'react';
import WeatherHome from './WeatherHome'; // Your WeatherHome component
import TodaysWeather from './TodaysWeather'; // The TodaysWeather component
import CheckDemand from './CheckDemand'; // The CheckDemand component
import More from './More'; // The More component
import './App.css'; // Ensure you have this file for styling

const App = () => {
  const [city, setCity] = useState('Mile End'); // Default city
  const [showTodaysWeather, setShowTodaysWeather] = useState(false); // Toggle for TodaysWeather component
  const [showCheckDemand, setShowCheckDemand] = useState(false); // Toggle for CheckDemand component
  const [showMore, setShowMore] = useState(false); // Toggle for More component

  // Function to handle city change
  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  return (
    <div className="App">
      <h1>Weather App</h1>

      {/* Show TodaysWeather page */}
      {showTodaysWeather ? (
        <TodaysWeather
          city={city}
          onShowWeatherHome={() => setShowTodaysWeather(false)} // Go back to WeatherHome
          onCityChange={handleCityChange}
        />
      ) : showCheckDemand ? (
        <CheckDemand
          city={city}
          onBack={() => setShowCheckDemand(false)} // Go back to WeatherHome
        />
      ) : showMore ? (
        <More
          city={city}
          onBack={() => setShowMore(false)} // Back to home
        />
      ) : (
        // Show main WeatherHome component
        <WeatherHome
          city={city}
          onCityChange={handleCityChange}
          onShowTodaysWeather={() => setShowTodaysWeather(true)} // Navigate to today's weather
          onShowCheckDemand={() => setShowCheckDemand(true)} // Navigate to CheckDemand
          onShowMore={() => setShowMore(true)} // Navigate to More
        />
      )}
    </div>
  );
};

export default App;
