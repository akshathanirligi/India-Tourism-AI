# India Tourism AI

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2f855a?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

India Tourism AI is an AI-powered smart tourism and travel-planning platform built with the MERN stack. It helps travelers discover destinations, plan personalized journeys, explore nearby services, and manage travel information through an intuitive, responsive experience.

## Features

- AI-powered personalized trip planner for customized travel ideas and itinerary suggestions
- Smart destination search and tourist places explorer
- Nearby essential services: hospitals, banks, ATMs, petrol pumps, police stations, pharmacies, bus stops, railway stations, and toilets
- Nearby hotels and nearby restaurants discovery
- Interactive maps for easier exploration
- Weather information to support better travel decisions
- User authentication with login and signup
- Saved trips and trip history
- Travel timeline for organized itineraries
- Booking hub for travel planning convenience
- PDF trip download for portable itineraries
- Responsive design across device sizes
- Dark mode and light mode support

<h2>📸 Screenshots</h2>

<table>
<tr>
<td align="center">
<img src="screenshots/home-page.png" width="450"/><br/>
<b>Home Page</b>
</td>
<td align="center">
<img src="screenshots/login-page.png" width="450"/><br/>
<b>Login</b>
</td>
</tr>

<tr>
<td align="center">
<img src="screenshots/signup-page.png" width="450"/><br/>
<b>Signup</b>
</td>
<td align="center">
<img src="screenshots/ai-planner.png" width="450"/><br/>
<b>AI Planner</b>
</td>
</tr>

<tr>
<td align="center">
<img src="screenshots/destination-details.png" width="450"/><br/>
<b>Destination Details</b>
</td>
<td align="center">
<img src="screenshots/trip-plan.png" width="450"/><br/>
<b>Trip Plan</b>
</td>
</tr>
</table>

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Maps | OpenStreetMap |
| Weather | OpenWeather API |
| AI | Google Gemini API |
| Deployment | Docker, Docker Compose |

## Project Architecture

```text
React.js (Frontend)
        ↓
Express.js REST API
        ↓
JWT Authentication
        ↓
MongoDB Atlas
```

## API Endpoints

```http
POST /api/auth/signup
POST /api/auth/login
GET /api/states
GET /api/districts
GET /api/tourist-places
POST /api/trip-plan
```

## Folder Structure

```text
India-Tourism-AI/
├── admin-panel/          # Administrative interface
├── ai/                   # AI-related resources
├── api/                  # API documentation/resources
├── backend/              # Express server and MongoDB Atlas integration
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── services/
├── database/             # Database resources
├── datasets/             # Tourism data
├── docs/                 # Project documentation
├── frontend/             # React + Vite client application
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
├── images/               # Visual assets
├── ppt/                  # Presentation materials
├── report/               # Project reports
└── README.md
```

## Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Docker Desktop (optional)

## Installation

### Local Development

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker Setup

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5177
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

## Docker Support

This project supports Docker and Docker Compose.

Run the following command to start both frontend and backend together:

```bash
docker compose up --build
```

## Future Improvements

- Android app
- iOS app
- AI chat assistant
- Hotel booking integration
- Flight booking integration
- Voice trip planner
- Multi-language support

## Author

**Akshatha Nirligi**

- GitHub: [@akshathanirligi](https://github.com/akshathanirligi)
- LinkedIn: [Akshatha Nirligi](https://www.linkedin.com/in/n-akshatha-569888320)

---

Built to make exploring India smarter, simpler, and more memorable.
