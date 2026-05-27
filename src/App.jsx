import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, Droplets, Compass } from 'lucide-react';
import GenerativeArt from './components/GenerativeArt';
import { fetchWeatherData } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWeatherData();
      setWeatherData(data);
      setLoading(false);
    };

    loadData();

    // Poll every 5 minutes (300000 ms)
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Connecting to atmospheric data...</p>
      </div>
    );
  }

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      {/* Background Generative Art Canvas */}
      <div className="canvas-container">
        <GenerativeArt weatherData={weatherData} />
      </div>

      {/* Glassmorphism Dashboard Overlay */}
      <div className="dashboard-overlay">
        <div className="dashboard-header">
          <h1>Ephemeral Art</h1>
          <p>Live Generative Canvas • Zurich, CH</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <Thermometer className="metric-icon" size={24} />
            <span className="metric-value">{weatherData.temperature}°C</span>
            <span className="metric-label">Temperature</span>
          </div>
          
          <div className="metric-card">
            <Wind className="metric-icon" size={24} />
            <span className="metric-value">{weatherData.windSpeed} km/h</span>
            <span className="metric-label">Wind Speed</span>
          </div>
          
          <div className="metric-card">
            <Compass className="metric-icon" size={24} />
            <span className="metric-value">{weatherData.windDirection}°</span>
            <span className="metric-label">Direction</span>
          </div>
          
          <div className="metric-card">
            <Droplets className="metric-icon" size={24} />
            <span className="metric-value">{weatherData.humidity}%</span>
            <span className="metric-label">Humidity</span>
          </div>
        </div>

        <div className="last-updated">
          Last updated: {formatTime(weatherData.time)}
        </div>
      </div>
    </div>
  );
}

export default App;
