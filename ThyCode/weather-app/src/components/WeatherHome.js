import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWeatherData } from "../utils/api";

const WeatherHome = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeatherData("London").then((data) => setWeather(data));
  }, []);

  return (
    <div className="weather-home">
      <h1 className="app-title">Weather App</h1>

      {weather && (
        <div className="weather-container">
          <h2 className="location">
            📍 {weather.name}
          </h2>
          <div className="weather-info">
            <div className="temperature">
              <span className="temp">{Math.round(weather.main.temp)}°</span>
              <span className="feels-like">Feels like {Math.round(weather.main.feels_like)}°</span>
            </div>
            <div className="weather-icon">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].description}
              />
              <p>{weather.weather[0].description}</p>
            </div>
          </div>

          {/* Hourly Forecast Placeholder */}
          <div className="hourly-forecast">
            <div className="hour"><p>4pm</p><img src="https://placehold.co/30x30" alt="icon" /><p>10°</p></div>
            <div className="hour"><p>5pm</p><img src="https://placehold.co/30x30" alt="icon" /><p>11°</p></div>
            <div className="hour"><p>6pm</p><img src="https://placehold.co/30x30" alt="icon" /><p>10°</p></div>
            <div className="hour"><p>7pm</p><img src="https://placehold.co/30x30" alt="icon" /><p>9°</p></div>
            <div className="hour"><p>8pm</p><img src="https://placehold.co/30x30" alt="icon" /><p>8°</p></div>
          </div>

          {/* Buttons */}
          <div className="buttons">
            <Link to="/today" className="button">Today's Weather</Link>
            <Link to="/demand" className="button">Check Demand</Link>
          </div>

          {/* Weekly Forecast Placeholder */}
          <div className="weekly-forecast">
            <div className="day"><p>Today</p><span>31%</span><span>9°</span></div>
            <div className="day"><p>Tuesday</p><span>26%</span><span>8°</span></div>
            <div className="day"><p>Wednesday</p><span>90%</span><span>10°</span></div>
            <div className="day"><p>Thursday</p><span>64%</span><span>11°</span></div>
            <div className="day"><p>Friday</p><span>61%</span><span>7°</span></div>
          </div>

          <Link to="/weekly" className="more-button">More</Link>
        </div>
      )}
    </div>
  );
};

export default WeatherHome;
