# 🏫 School Management API

A production-ready REST API built with **Node.js**, **Express.js**, and **MySQL** to manage school data with proximity-based sorting using the Haversine formula.

---

## 📁 Project Structure

```
school-management-api/
├── src/
│   ├── app.js                        # Express entry point
│   ├── config/
│   │   └── db.js                     # MySQL connection pool + DB init
│   ├── controllers/
│   │   └── schoolController.js       # Business logic (addSchool, listSchools)
│   ├── middleware/
│   │   └── validators.js             # express-validator rules
│   └── routes/
│       └── schoolRoutes.js           # Route definitions
├── database/
│   └── setup.sql                     # DB + table creation script (with seed data)
├── postman/
│   └── SchoolManagement.postman_collection.json
├── .env.example                      # Environment variable template
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

| Tool    | Version  |
|---------|----------|
| Node.js | ≥ 16.x   |
| npm     | ≥ 8.x    |
| MySQL   | ≥ 5.7 / 8.x |

---

## 🚀 Local Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd school-management-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

### 3. Set Up Database

```bash
mysql -u root -p < database/setup.sql
```

> The app also auto-creates the `schools` table on first start if it doesn't exist.

### 4. Start the Server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Server runs at: **http://localhost:3000**

---

## 📡 API Reference

### Health Check

```
GET /
```

**Response:**
```json
{
  "success": true,
  "message": "School Management API is running 🏫",
  "version": "1.0.0"
}
```

---

### POST /addSchool

Add a new school to the database.

**Request Body (JSON):**

| Field     | Type   | Required | Validation                       |
|-----------|--------|----------|----------------------------------|
| name      | string | ✅       | 2–255 characters, non-empty      |
| address   | string | ✅       | 5–500 characters, non-empty      |
| latitude  | float  | ✅       | -90 to 90                        |
| longitude | float  | ✅       | -180 to 180                      |

**Example Request:**
```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Delhi Public School",
    "address": "Sector 45, Gurugram, Haryana",
    "latitude": 28.4595,
    "longitude": 77.0266
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Sector 45, Gurugram, Haryana",
    "latitude": 28.4595,
    "longitude": 77.0266
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "latitude", "message": "Latitude must be a number between -90 and 90" }
  ]
}
```

---

### GET /listSchools

Fetch all schools sorted by proximity to the user's location.

**Query Parameters:**

| Param     | Type  | Required | Description          |
|-----------|-------|----------|----------------------|
| latitude  | float | ✅       | User's latitude      |
| longitude | float | ✅       | User's longitude     |

**Example Request:**
```bash
curl "http://localhost:3000/listSchools?latitude=18.5204&longitude=73.8567"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "5 school(s) found, sorted by proximity.",
  "user_location": { "latitude": 18.5204, "longitude": 73.8567 },
  "data": [
    {
      "id": 5,
      "name": "Symbiosis School",
      "address": "Senapati Bapat Road, Pune, MH",
      "latitude": 18.5204,
      "longitude": 73.8567,
      "created_at": "2024-01-01T00:00:00.000Z",
      "distance_km": 0
    },
    {
      "id": 3,
      "name": "The Cathedral School",
      "address": "Fort Area, Mumbai, Maharashtra",
      "latitude": 18.9322,
      "longitude": 72.8338,
      "created_at": "2024-01-01T00:00:00.000Z",
      "distance_km": 118.34
    }
  ]
}
```

---

## 📐 Distance Algorithm — Haversine Formula

Schools are sorted using the **Haversine formula**, which calculates the great-circle distance between two points on Earth accounting for its curvature.

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
d = 2R × atan2(√a, √(1-a))       where R = 6371 km
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE schools (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  address    VARCHAR(500) NOT NULL,
  latitude   FLOAT        NOT NULL,
  longitude  FLOAT        NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Postman Collection

Import `postman/SchoolManagement.postman_collection.json` into Postman.

Includes:
- ✅ Health Check
- ✅ Add School (success, validation error, duplicate)
- ✅ List Schools (success, missing params)

Update the `base_url` variable in Postman to your deployed URL.

---

## ☁️ Deployment Guide

### Option A — Railway (Recommended, Free Tier)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MySQL plugin — Railway auto-sets `DATABASE_URL`
4. Set environment variables from `.env.example`
5. Deploy — Railway provides a live URL

### Option B — Render

1. Push to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Start command: `npm start`
4. Add a **PostgreSQL** or use an external MySQL (PlanetScale)
5. Set env vars and deploy

### Option C — VPS (DigitalOcean / AWS EC2)

```bash
# Install Node & PM2
npm install -g pm2

# Start with PM2 (keeps alive after SSH exit)
pm2 start src/app.js --name school-api
pm2 startup && pm2 save
```

---

## 📋 HTTP Status Codes Used

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK — successful GET            |
| 201  | Created — school added         |
| 400  | Bad Request — validation error |
| 404  | Not Found — unknown route      |
| 409  | Conflict — duplicate school    |
| 500  | Internal Server Error          |

---

## 👨‍💻 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via mysql2 with connection pooling)
- **Validation:** express-validator
- **Distance:** Haversine formula (pure JS, no external library)
