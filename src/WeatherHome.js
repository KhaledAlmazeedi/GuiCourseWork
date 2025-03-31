import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Weather.css'; // Import the CSS file for styling

const WeatherHome = ({ city, onShowTodaysWeather, onCityChange, onShowCheckDemand, onShowMore }) => {
  // State variables to manage weather data, loading, and errors
  const [weatherData, setWeatherData] = useState(null); // Current weather data
  const [forecastData, setForecastData] = useState([]); // Weekly forecast data
  const [hourlyData, setHourlyData] = useState([]); // Hourly forecast data for the next 5 hours
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showMore, setShowMore] = useState(false); // State for "More" button functionality

  const apiKey = '197f3dd796a4a34d3134600111570b71'; // OpenWeatherMap API key

  // Fetch current weather data from the API
  const fetchCurrentWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data); // Update state with current weather data
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error(error);
      setError('Failed to fetch current weather data. Please check the city name or try again later.');
    }
  }, [city, apiKey]);

  // Fetch 5-day/3-hour forecast data from the API
  const fetchForecast = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      // Extract the next 4 hours of hourly data
      const next4Hours = response.data.list.slice(0, 4);
      setHourlyData(next4Hours); // Update state with hourly forecast data

      // Group forecast data by day for the weekly forecast
      const groupedForecast = groupForecastByDay(response.data.list);
      setForecastData(groupedForecast); // Update state with weekly forecast data
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error(error);
      setError('Failed to fetch forecast data. Please check the city name or try again later.');
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  }, [city, apiKey]);

  // Helper function to group forecast data by day
  const groupForecastByDay = (forecastList) => {
    const grouped = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }); // Convert timestamp to weekday
      if (!grouped[date]) {
        grouped[date] = item; // Group by day
      }
    });
    return Object.values(grouped).slice(0, 7); // Return only 7 days (Monday to Sunday)
  };

  // Fetch weather data when the component mounts or when the city changes
  useEffect(() => {
    fetchCurrentWeather();
    fetchForecast();
  }, [fetchCurrentWeather, fetchForecast]);

  // Handle "Check Demand" button click
  const handleCheckDemand = () => {
    if (onShowCheckDemand) {
      onShowCheckDemand(); // Trigger the callback to switch to the demand view
    }
  };

  // Handle "Today's Weather" button click
  const handleTodayWeather = () => {
    if (onShowTodaysWeather) {
      onShowTodaysWeather(); // Trigger the callback to show the Today's Weather component
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app-wrapper">
      <div className="weather-container">
        {/* Top Section: Current Weather and Hourly Forecast */}
        <div className="top-section">
          {/* Current Weather Information */}
          <div className="weather-info">
            <h2 className="mile-end">{weatherData.name}</h2>
            <p className="feels-like">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            {/* Weather Icon for Current Weather */}
            {weatherData.weather[0].icon && (
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="weather-icon"
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide the broken icon
                }}
              />
            )}
          </div>

          {/* Hourly Weather for the Next 5 Hours */}
          <div className="hourly-weather">
            <h3>Next 4 Hours</h3>
            <div className="hourly-forecast">
              {hourlyData.map((hour, index) => (
                <div className="hourly-item" key={index}>
                  <p className="hour-time">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {/* Weather Icon for Hourly Forecast */}
                  {hour.weather[0].icon && (
                    <img
                      src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt={hour.weather[0].description}
                      className="weather-icon"
                      onError={(e) => {
                        e.target.style.display = 'none'; // Hide the broken icon
                      }}
                    />
                  )}
                  <p className="hour-temp">{Math.round(hour.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons for Navigation */}
          <div className="buttons">
            <button className="check-demand-button" onClick={handleCheckDemand}>Check Demand</button>
            <button className="today-weather-button" onClick={handleTodayWeather}>Today's Weather</button>
          </div>
        </div>

        {/* Bottom Section: Weekly Forecast */}
        <div className="bottom-section">
          <div className="weekly-forecast">
            <h3>Weekly Forecast</h3>
            <div className="forecast-box">
              {forecastData.map((day, index) => (
                <div className="forecast-item" key={index}>
                  <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  {/* Weather Icon for Weekly Forecast */}
                  {day.weather[0].icon && (
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="weather-icon"
                      onError={(e) => {
                        e.target.style.display = 'none'; // Hide the broken icon
                      }}
                    />
                  )}
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
            {/* "More" Button */}
            <button className="more-button" onClick={onShowMore}>More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHome;