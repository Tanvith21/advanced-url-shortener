# URL Shortener API

A production-ready URL shortening service built with Node.js, Express, MongoDB Atlas, and Docker.

## Features
- Shorten long URLs to 6-character codes
- Custom aliases
- URL expiry (TTL)
- Click analytics
- Rate limiting (10 req/min per IP)
- Dockerized for reproducible deployment

## Tech Stack
Node.js, Express.js, MongoDB Atlas, Mongoose, Docker, nanoid

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shorten | Shorten a URL |
| GET | /:code | Redirect to original URL |
| GET | /api/analytics/:code | Get click analytics |

## Setup

```bash
git clone https://github.com/yourusername/url-shortener
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
