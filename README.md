# Campaign Management Platform

A production-ready full-stack web application designed for an advertising agency.

## Features
- **Frontend**: React 18, Vite, Tailwind CSS (Dark Mode), Recharts, Zustand.
- **Backend API**: Node.js, Express, PostgreSQL via Prisma, JWT Auth, Rate Limiting, Websocket Alerts.
- **AI Microservice**: Standalone express server utilizing OpenAI stream generating SSE payloads.

## Project Structure
```text
assignment/
├── frontend/                # React Dashboard UI
├── backend/                 # Campaign REST API & Rules engine
├── ai-microservice/         # Express SSE streamer
├── docker-compose.yml       # Docker definitions for entire stack
└── README.md
```

## Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node 18+

### 2. Environment Variables
Ensure the following `.env` configurations are set:

**ai-microservice/.env**
```env
PORT=5001
OPENAI_API_KEY=your_openai_api_key_here
```

**backend/.env**
```env
PORT=5000
DATABASE_URL="postgresql://admin:password@localhost:5432/campaign_db?schema=public"
JWT_SECRET="supersecretjwt"
```

### 3. Docker Launch
Spin up Postgres and all apps using Docker Compose.
```bash
docker-compose up --build -d
```
*Note: Wait a moment for PostgreSQL to initialize.*

### 4. Database Initialization 
For dev setup, initialize the schema directly on your machine or inside the container:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
```

### Accessing the applications:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/health](http://localhost:5000/health)
- **AI Microservice:** [http://localhost:5001/health](http://localhost:5001/health)

## Deployment Guide
This platform is designed to be easily deployed to container environments. 
1. Supply managed PostgreSQL instances instead of Docker volumes in Prod.
2. Build images using GitHub Actions.
3. Deploy frontend static bundle to Vercel/Netlify.
4. Deploy Backend and AI Service to AWS ECS, DigitalOcean App Platform, or Google Cloud Run.
