import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './More.css';

// The More component displays a 7-day weather forecast for a given city
const More = ({ city, onBack }) => {
  // State variables to manage forecast data, loading state, and error messages
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API key for OpenWeatherMap
  const apiKey = '197f3dd796a4a34d3134600111570b71';

  // Debug effect to log when the component mounts or the city prop changes
  useEffect(() => {
    console.log("More component mounted or city changed:", city);
  }, [city]);

  // Effect to fetch the weather forecast when the city changes
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if the component unmounts

    const fetchForecast = async () => {
      try {
        console.log("Fetching forecast for:", city);
        setLoading(true); // Set loading state to true before fetching
        setError(null); // Clear any previous errors

        // Make an API request to fetch the 5-day weather forecast
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`,
          { timeout: 10000 } // Set a timeout of 10 seconds
        );

        console.log("API response:", response.data);

        if (!isMounted) return; // Prevent state updates if the component is unmounted

        // Group the forecast data by day and calculate min/max temperatures
        const dailyForecast = response.data.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          });

          if (!acc[date]) {
            // Initialize the day's forecast if it doesn't exist
            acc[date] = {
              dt: item.dt,
              weather: item.weather,
              minTemp: Math.round(item.main.temp_min),
              maxTemp: Math.round(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon
            };
          } else {
            // Update the day's min/max temperatures
            acc[date].minTemp = Math.min(acc[date].minTemp, Math.round(item.main.temp_min));
            acc[date].maxTemp = Math.max(acc[date].maxTemp, Math.round(item.main.temp_max));
          }
          return acc;
        }, {});

        if (isMounted) {
          // Update the forecast state with the first 7 days of data
          setForecast(Object.values(dailyForecast).slice(0, 7));
          console.log("Forecast data updated");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          // Set an error message if the API request fails
          setError(err.response?.data?.message || err.message || "Failed to load forecast");
        }
      } finally {
        if (isMounted) {
          // Set loading state to false after the request completes
          setLoading(false);
          console.log("Loading complete");
        }
      }
    };

    fetchForecast();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      console.log("Cleanup: cancelling pending requests");
    };
  }, [city]);

  // Debug log to track the component's render state
  console.log("Rendering More component with:", { loading, error, forecast });

  // Render a loading message while the data is being fetched
  if (loading) {
    return (
      <div className="more-container">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  // Render an error message if the API request fails
  if (error) {
    return (
      <div className="more-container">
        <div className="error">{error}</div>
        <button className="back-button" onClick={onBack}>
          Back to Home
        </button>
      </div>
    );
  }

  // Render the 7-day weather forecast
  return (
    <div className="more-container">
      <h2 className="section-title">7-Day Forecast for {city}</h2>
      
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div className="forecast-day" key={`${day.dt}-${index}`}>
            {/* Display the day name */}
            <div className="day-header">
              <span className="day-name">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              {/* Display the weather icon */}
              <div className="icon-container">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="day-icon"
                  onError={(e) => {
                    // Fallback icon in case of an error
                    e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                  }}
                />
              </div>
            </div>
        
            {/* Display the day's min and max temperatures */}
            <div className="day-temps">
              <span className="max-temp">{day.maxTemp}°</span>
              <span className="min-temp">{day.minTemp}°</span>
            </div>
        
            {/* Display the weather description */}
            <p className="day-description">{day.description}</p>
          </div>
        ))}
      </div>

      {/* Back button to navigate to the home screen */}
      <button className="back-button" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
};

export default More;