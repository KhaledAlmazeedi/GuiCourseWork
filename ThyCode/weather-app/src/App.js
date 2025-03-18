import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WeatherHome from "./components/WeatherHome";
import TodayWeather from "./components/TodayWeather";
import DemandPage from "./components/DemandPage";
import WeeklyForecast from "./components/WeeklyForecast";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        
        <Routes>
          <Route path="/" element={<WeatherHome />} />
          <Route path="/today" element={<TodayWeather />} />
          <Route path="/demand" element={<DemandPage />} />
          <Route path="/weekly" element={<WeeklyForecast />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
