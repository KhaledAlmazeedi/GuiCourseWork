import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWeatherData } from "../utils/api";

const WeatherHome = () => {
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);


  useEffect(() => {
    fetchWeatherData("London").then((data) => {
      console.log("API Response:", data); // ✅ Debugging: See full API response
  
      if (data) {
        setWeather(data.current);
  
        if (data.hourly && Array.isArray(data.hourly)) { // ✅ Ensure `hourly` exists & is an array
          const currentTime = new Date().getHours();
  
          const filteredHours = data.hourly
            .filter((hour) => new Date(hour.dt * 1000).getHours() > currentTime)
            .slice(0, 3); // Get only next 9 hours
  
          console.log("Filtered Hourly Data:", filteredHours); // ✅ Debugging
          setHourlyForecast(filteredHours);
        } else {
          console.error("No hourly forecast data available or incorrect format.");
        }
      }
    });
  }, []);
  
  

  return (
    <div className="weather-home">
      <h1 className="app-title">Weather App</h1>

      {weather && (
        <div className="weather-container">
          <h2 className="location">
            📍 {weather.name}
          </h2>
          <div className = "separator">
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

          {/* Hourly Forecast */}
            <div className="hourly-forecast">
              {hourlyForecast.length > 0 ? (
                hourlyForecast.map((hour, index) => (
                  <div key={index} className="hour">
                    <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <img 
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} 
                      alt={hour.weather[0].description} 
                    />
                    <p>{Math.round(hour.main.temp)}°</p>
                  </div>
                ))
              ) : (
                <p>Loading hourly forecast...</p>
              )}
            </div>


          </div>

          {/* Buttons */}
          <div className="buttons">
          <Link to="/today" className="button">Today's Weather</Link>
          <Link to="/demand" className="button">Check Demand</Link>
          </div>


        {/* Weekly Forecast */}
        <div className="weekly-forecast">
          {dailyForecast && dailyForecast.map((day, index) => (
            <div key={index} className="day">
              <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</p>
              <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} />
              <div className="precipitation">
                🌧️ {Math.round(day.pop * 100)}% 
              </div>

              <span>{Math.round(day.temp.day)}°</span>
            </div>
           ))}
        </div>


          <Link to="/weekly" className="more-button">More</Link>
        </div>
      )}
    </div>
  );
};

export default WeatherHome;
