# Advanced URL Shortener

A production-grade distributed URL shortening service built with Node.js, Express, MongoDB Atlas, Redis, and Bull.

## Features
- Shorten long URLs to 6-character nanoid codes
- Custom aliases and TTL-based URL expiry
- Redis cache-aside pattern (~5ms redirect latency for hot URLs)
- Async click analytics via Bull job queue (decoupled from redirect path)
- Geolocation tracking (country, city) per click
- Distributed rate limiting via Redis sliding window (10 req/min per IP)
- Health check endpoint monitoring MongoDB + Redis status
- Dockerized for reproducible deployment

## Tech Stack
Node.js, Express.js, MongoDB Atlas, Redis, Bull, Docker, nanoid

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shorten | Shorten a URL |
| GET | /:code | Redirect to original URL |
| GET | /api/analytics/:code | Get click analytics + geo data |
| GET | /api/health | Health check for all services |

## Architecture
- **Redis** handles caching (cache-aside) and distributed rate limiting
- **Bull** job queue processes click analytics asynchronously
- **MongoDB Atlas** stores URLs, click history, and geo data
- **Docker Compose** orchestrates all services

## Setup

```bash
git clone https://github.com/Tanvith21/url-shortener
cd url-shortener
npm install
cp .env.example .env
# Add your MongoDB Atlas URI to .env
npm run dev
```

## Environment Variables
## Docker
```bash
docker-compose up --build
```
