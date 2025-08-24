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

// Proxy current weather
app.get('/api/weather', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'missing q' });
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const resp = await axios.get(url, { params: { q, units: 'metric', appid: OPENWEATHER_KEY } });
    res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: err.message });
  }
});

// Proxy One Call (7-day forecast)
app.get('/api/onecall', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'missing lat or lon' });
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall`;
    const resp = await axios.get(url, { params: { lat, lon, exclude: 'current,minutely,hourly,alerts', units: 'metric', appid: OPENWEATHER_KEY } });
    res.json(resp.data);
  } catch (err) {
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

app.listen(PORT, () => console.log(`Proxy server listening on http://localhost:${PORT}`));
