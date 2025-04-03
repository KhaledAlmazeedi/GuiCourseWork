import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './WeatherHome.css';

// Main WeatherHome component
const WeatherHome = ({ city, onShowTodaysWeather, onCityChange, onShowCheckDemand, onShowMore }) => {
  // State variables for managing weather data, loading, errors, and UI interactions
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // OpenWeatherMap API key
  const apiKey = '197f3dd796a4a34d3134600111570b71';

  // Fetch current weather data for the given city
  const fetchCurrentWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch current weather data. Please check the city name or try again later.');
    }
  }, [city, apiKey]);

  // Fetch forecast data for the given city
  const fetchForecast = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      const next4Hours = response.data.list.slice(0, 4); // Get the next 4 hours of forecast
      setHourlyData(next4Hours);

      const groupedForecast = groupForecastByDay(response.data.list); // Group forecast by day
      setForecastData(groupedForecast);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch forecast data. Please check the city name or try again later.');
    } finally {
      setLoading(false);
    }
  }, [city, apiKey]);

  // Fetch city suggestions for the search input
  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: query,
          limit: 5,
          appid: apiKey,
        },
      });

      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching city suggestions:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Group forecast data by day
  const groupForecastByDay = (forecastList) => {
    const grouped = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
      if (!grouped[date]) {
        grouped[date] = item;
      }
    });
    return Object.values(grouped).slice(0, 7); // Return the next 7 days of forecast
  };

  // Fetch weather data when the component mounts or the city changes
  useEffect(() => {
    fetchCurrentWeather();
    fetchForecast();
  }, [fetchCurrentWeather, fetchForecast]);

  // Handle "Check Demand" button click
  const handleCheckDemand = () => {
    if (onShowCheckDemand) {
      onShowCheckDemand();
    }
  };

  // Handle "Today's Weather" button click
  const handleTodayWeather = () => {
    if (onShowTodaysWeather) {
      onShowTodaysWeather();
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Show error message if there is an error
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Render the weather app UI
  return (
    <div className="app-wrapper">
      <div className="weather-container">
        <div className="top-section">
          {/* Search bar for entering city name */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!searchInput.trim()) return;
              onCityChange(searchInput.trim());
              fetchCurrentWeather();
              fetchForecast();
              setSearchInput('');
              setShowSuggestions(false);
            }}
            className="search-bar"
          >
            <input
              type="text"
              placeholder="Enter city name"
              value={searchInput}
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);
                fetchCitySuggestions(value);
              }}
            />
            <button type="submit">Search</button>
            {/* Dropdown for city suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-dropdown">
                {suggestions.map((cityObj, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      const selectedCity = cityObj.name;
                      onCityChange(selectedCity);
                      fetchCurrentWeather();
                      fetchForecast();
                      setSearchInput('');
                      setShowSuggestions(false);
                    }}
                  >
                    {cityObj.name}{cityObj.state ? `, ${cityObj.state}` : ''}, {cityObj.country}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Current weather information */}
          <div className="weather-info">
            <h2 className="mile-end">{weatherData.name}</h2>
            <p className="feels-like">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            {weatherData.weather[0].icon && (
              <div className="weather-icon-container">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  className="weather-icon current-icon"
                />
              </div>
            )}
          </div>

          {/* Hourly weather forecast */}
          <div className="hourly-weather">
            <h3>Next 12 Hours</h3>
            <div className="hourly-forecast">
              {hourlyData.map((hour, index) => (
                <div className="hourly-item" key={index}>
                  <p className="hour-time">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="weather-icon-container">
                    <img
                      src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt={hour.weather[0].description}
                      className="weather-icon hourly-icon"
                    />
                  </div>
                  <p className="hour-temp">{Math.round(hour.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons for additional actions */}
          <div className="buttons">
            <button className="check-demand-button" onClick={handleCheckDemand}>Check Demand</button>
            <button className="today-weather-button" onClick={handleTodayWeather}>Today's Weather</button>
          </div>
        </div>

        {/* Weekly weather forecast */}
        <div className="bottom-section">
          <div className="weekly-forecast">
            <h3>Weekly Forecast</h3>
            <div className="forecast-box">
              {forecastData.map((day, index) => (
                <div className="forecast-item" key={index}>
                  <p className="forecast-day">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <div className="weather-icon-container">
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="weather-icon forecast-icon"
                    />
                  </div>
                  <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
            <button className="more-button" onClick={onShowMore}>More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHome;