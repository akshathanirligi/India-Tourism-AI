# India Tourism AI API

## Required environment variables

Copy `.env.example` to `.env` and provide production values for `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. `CLIENT_ORIGIN` accepts a comma-separated allowlist of deployed frontend origins. The server refuses to start without the database URI and JWT secret, and production additionally requires the allowed frontend origin.

Use a long, unique JWT secret and a MongoDB connection string that is restricted to the deployment environment. Do not commit `.env`.

## Verification and startup

Run `npm ci`, `npm run build`, then `npm start`. `GET /health` is available for deployment health checks.
