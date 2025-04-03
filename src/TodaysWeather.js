import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodaysWeather.css'; // Import the CSS file

const TodaysWeather = ({ city, onShowWeatherHome, onCityChange }) => {
  // State variables to manage weather data, errors, loading state, and city suggestions
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // OpenWeather API key and base URL
  const API_KEY = '197f3dd796a4a34d3134600111570b71';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Fetch city suggestions based on user input
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      });

      setSuggestions(response.data); // Update suggestions with API response
      setShowSuggestions(true); // Show the suggestions dropdown
    } catch (err) {
      console.error('Error fetching city suggestions:', err);
      setSuggestions([]);
      setShowSuggestions(false); // Hide suggestions on error
    }
  };

  // Fetch weather data for the specified city
  const fetchWeatherData = async (cityName) => {
    setLoading(true); // Show loading indicator
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric', // Use metric units for temperature
        },
      });
      setWeatherData(response.data); // Update weather data with API response
      setError(''); // Clear any previous errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!city.trim()) {
      setError('Please enter a city name.'); // Show error if input is empty
      return;
    }
    console.log("Fetching weather for:", city);
    fetchWeatherData(city.trim()); // Fetch weather data for the entered city
  };

  // Generate a dynamic road closure message based on weather conditions
  const getRoadClosureMessage = (weather) => {
    if (weather.includes('rain')) {
      return 'Potential road closures due to rain';
    } else if (weather.includes('snow')) {
      return 'Potential road closures due to snow';
    } else if (weather.includes('fog')) {
      return 'Potential road closures due to fog';
    } else {
      return 'No road closures expected';
    }
  };

  return (
    <div className="app-wrapper">
      <div className="weather-container">
        {/* Top Section */}
        <div className="top-section">
          {/* Search bar for entering city name */}
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                const value = e.target.value;
                onCityChange(value); // Update city state in parent component
                fetchCitySuggestions(value); // Fetch city suggestions
              }}
            />
            <button type="submit">Search</button>
          </form>

          {/* Display city suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((cityObj, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onCityChange(cityObj.name); // Update city state with selected suggestion
                    fetchWeatherData(cityObj.name); // Fetch weather data for selected city
                    setShowSuggestions(false); // Hide suggestions dropdown
                  }}
                >
                  {cityObj.name}{cityObj.state ? `, ${cityObj.state}` : ''}, {cityObj.country}
                </li>
              ))}
            </ul>
          )}

          {/* Display loading indicator, error messages, or weather data */}
          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          {weatherData && (
            <div className="weather-info">
              {/* Display weather information */}
              <h2 className="mile-end">{weatherData.name}</h2>
              <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
              <p className="feels-like">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
              <div className="weather-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                />
              </div>
              <p className="weather-description">{weatherData.weather[0].description}</p>
              <p className="road-closure">
                {getRoadClosureMessage(weatherData.weather[0].main)}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        {weatherData && (
          <div className="bottom-section">
            <div className="weather-details">
              {/* Display additional weather details */}
              <div className="detail-item">
                <p>Wind</p>
                <p>{weatherData.wind.speed} km/h</p>
              </div>
              <div className="detail-item">
                <p>Humidity</p>
                <p>{weatherData.main.humidity}%</p>
              </div>
              <div className="detail-item">
                <p>AQI</p>
                <p>Low (1)</p>
              </div>
              <div className="detail-item">
                <p>UV Index</p>
                <p>Low</p>
              </div>
              <div className="detail-item">
                <p>Visibility</p>
                <p>{(weatherData.visibility / 1000).toFixed(2)} km</p>
              </div>
              <div className="detail-item">
                <p>Pollen</p>
                <p>None</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={onShowWeatherHome}>Go to Weather Home</button>
        </div>
      </div>
    </div>
  );
};

export default TodaysWeather;
