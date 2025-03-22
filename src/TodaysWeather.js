import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodaysWeather.css'; // Import the CSS file

const TodaysWeather = ({ city, onShowWeatherHome, onCityChange }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '197f3dd796a4a34d3134600111570b71'; // Your OpenWeather API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Fetch weather data for the current city
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric', // Use 'imperial' for Fahrenheit
        },
      });
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
      setCity(''); // Clear the input field
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data for the current city on component mount
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    } else {
      setError('Please enter a city name.');
    }
  };

  // Dynamic road closure message
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
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                onCityChange(e.target.value); // Update city in App.js
              }}
            />
            <button type="submit">Search</button>
          </form>

          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          {weatherData && (
            <div className="weather-info">
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