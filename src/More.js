import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './More.css'; // Optional styling

const More = ({ city, onBack }) => {
  const [forecast, setForecast] = useState([]);
  const apiKey = '197f3dd796a4a34d3134600111570b71';

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        // Group forecast by day
        const daily = {};
        response.data.list.forEach(item => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!daily[date]) {
            daily[date] = item;
          }
        });

        setForecast(Object.values(daily).slice(0, 7)); // 7-day forecast
      } catch (err) {
        console.error('Failed to fetch extended forecast:', err);
      }
    };

    fetchForecast();
  }, [city, apiKey]);

  return (
    <div className="app-wrapper">
      <div className="weather-container">
        <h2>7-Day Forecast for {city}</h2>
        <div className="forecast-box">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="weather-icon"
              />
              <p>{Math.round(day.main.temp)}°C</p>
            </div>
          ))}
        </div>

        <button onClick={onBack} className="back-button">Back</button>
      </div>
    </div>
  );
};

export default More;
