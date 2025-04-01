import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './More.css';

const More = ({ city, onBack }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = '197f3dd796a4a34d3134600111570b71';

  // Add this debug effect
  useEffect(() => {
    console.log("More component mounted or city changed:", city);
  }, [city]);

  useEffect(() => {
    let isMounted = true; // To prevent memory leaks

    const fetchForecast = async () => {
      try {
        console.log("Fetching forecast for:", city);
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`,
          { timeout: 10000 } // 10 second timeout
        );

        console.log("API response:", response.data);

        if (!isMounted) return;

        // Improved day grouping
        const dailyForecast = response.data.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          });
          
          if (!acc[date]) {
            acc[date] = {
              dt: item.dt,
              weather: item.weather,
              minTemp: Math.round(item.main.temp_min),
              maxTemp: Math.round(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon
            };
          } else {
            acc[date].minTemp = Math.min(acc[date].minTemp, Math.round(item.main.temp_min));
            acc[date].maxTemp = Math.max(acc[date].maxTemp, Math.round(item.main.temp_max));
          }
          return acc;
        }, {});

        if (isMounted) {
          setForecast(Object.values(dailyForecast).slice(0, 7));
          console.log("Forecast data updated");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Failed to load forecast");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("Loading complete");
        }
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
      console.log("Cleanup: cancelling pending requests");
    };
  }, [city]);

  // Add this debug render log
  console.log("Rendering More component with:", { loading, error, forecast });

  if (loading) {
    return (
      <div className="more-container">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

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

  return (
    <div className="more-container">
      <h2 className="section-title">7-Day Forecast for {city}</h2>
      
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div className="forecast-day" key={`${day.dt}-${index}`}>
            <div className="day-header">
              <span className="day-name">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="day-icon"
                onError={(e) => {
                  e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                }}
              />
            </div>
            
            <div className="day-temps">
              <span className="max-temp">{day.maxTemp}°</span>
              <span className="min-temp">{day.minTemp}°</span>
            </div>
            
            <p className="day-description">
              {day.description}
            </p>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
};

export default More;