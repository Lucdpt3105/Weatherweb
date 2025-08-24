Proxy server for the weather sample

1. Copy `.env.example` to `.env` and fill your keys.
2. npm install
3. npm run dev (or npm start)

Client should call /api/weather?q=City and /api/onecall?lat=..&lon=.. and /api/unsplash?query=... instead of hitting external APIs directly.
