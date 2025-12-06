const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Serve static client files from project root
app.use(express.static(__dirname));

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!OPENWEATHER_KEY) {
  console.warn('Warning: OPENWEATHER_API_KEY not set in environment');
}
if (!UNSPLASH_KEY) {
  console.warn('Warning: UNSPLASH_ACCESS_KEY not set in environment');
}

// Proxy current weather - Using Open-Meteo (free, no API key needed)
app.get('/api/weather', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'missing q' });
  try {
    // First, get coordinates from geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search`;
    const geoResp = await axios.get(geoUrl, { params: { name: q, count: 1, language: 'en', format: 'json' } });
    
    if (!geoResp.data.results || geoResp.data.results.length === 0) {
      return res.status(404).json({ cod: 404, message: 'city not found' });
    }
    
    const location = geoResp.data.results[0];
    const { latitude, longitude, name, country, country_code } = location;
    
    // Get weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast`;
    const weatherResp = await axios.get(weatherUrl, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,surface_pressure,cloud_cover,is_day',
        timezone: 'auto'
      }
    });
    
    const current = weatherResp.data.current;
    
    // Map weather codes to custom icon filenames (day/night aware)
    const isNight = current.is_day === 0;
    const weatherCodeMap = {
      0: { description: 'Clear sky', icon: isNight ? 'clear-night.svg' : 'clear-day.svg' },
      1: { description: 'Mainly clear', icon: isNight ? 'partly-cloudy-night.svg' : 'partly-cloudy-day.svg' },
      2: { description: 'Partly cloudy', icon: isNight ? 'partly-cloudy-night.svg' : 'partly-cloudy-day.svg' },
      3: { description: 'Overcast', icon: 'cloudy.svg' },
      45: { description: 'Foggy', icon: 'cloudy.svg' },
      48: { description: 'Depositing rime fog', icon: 'cloudy.svg' },
      51: { description: 'Light drizzle', icon: isNight ? 'night-rain.svg' : 'rain.svg' },
      53: { description: 'Moderate drizzle', icon: isNight ? 'night-rain.svg' : 'rain.svg' },
      55: { description: 'Dense drizzle', icon: isNight ? 'night-rain.svg' : 'rain.svg' },
      61: { description: 'Slight rain', icon: isNight ? 'night-rain.svg' : 'rain.svg' },
      63: { description: 'Moderate rain', icon: isNight ? 'night-rain.svg' : 'rain.svg' },
      65: { description: 'Heavy rain', icon: isNight ? 'night-rain.svg' : 'rain-heavy.svg' },
      71: { description: 'Slight snow', icon: isNight ? 'night-snow.svg' : 'snow.svg' },
      73: { description: 'Moderate snow', icon: isNight ? 'night-snow.svg' : 'snow.svg' },
      75: { description: 'Heavy snow', icon: isNight ? 'night-snow.svg' : 'snow.svg' },
      95: { description: 'Thunderstorm', icon: isNight ? 'night-storm.svg' : 'thunderstorm.svg' }
    };
    
    const weatherInfo = weatherCodeMap[current.weather_code] || { description: 'Unknown', icon: '01d' };
    
    // Format response to match OpenWeather API structure
    const response = {
      coord: { lon: longitude, lat: latitude },
      weather: [{
        id: current.weather_code,
        main: weatherInfo.description.split(' ')[0],
        description: weatherInfo.description.toLowerCase(),
        icon: weatherInfo.icon
      }],
      main: {
        temp: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.surface_pressure
      },
      clouds: { all: current.cloud_cover },
      sys: { country: country_code || country },
      name: name,
      cod: 200
    };
    
    res.json(response);
  } catch (err) {
    console.error('Weather API error:', err.message);
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: err.message });
  }
});

// Proxy Unsplash search
app.get('/api/unsplash', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'missing query' });
  try {
    const url = `https://api.unsplash.com/search/photos`;
    const resp = await axios.get(url, { params: { query, orientation: 'landscape', per_page: 1, client_id: UNSPLASH_KEY } });
    res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: err.message });
  }
});

// Listen khi chạy local
if (require.main === module) {
  app.listen(PORT, () => console.log(`Proxy server listening on http://localhost:${PORT}`));
}

// Export cho Vercel serverless
module.exports = app;
