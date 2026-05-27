# LocalGig

LocalGig is a full-stack web platform that connects college students with local clients for part-time jobs, freelance work, and short-term gigs. The platform enables students to discover nearby opportunities while allowing clients to post and manage gigs easily.

## Features

* Student Registration & Login
* Client Registration & Login
* Secure Authentication using JWT
* Admin Login & Dashboard
* Gig Posting & Management
* Job Application System
* Reviews & Ratings
* Reports & Complaint Management
* Location-based Gig Support
* Responsive UI Design
* REST API Integration
* MySQL Database Connectivity
* Cloud Deployment using Render, Railway, and Vercel

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Railway (Database)

---

## Project Structure

```bash
miniproject/
│
├── localgig-backend/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── localgig-frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── main.tsx
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/sneha27042005/miniproject.git
cd miniproject
```

---

## Backend Setup

```bash
cd localgig-backend
npm install
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

```bash
cd localgig-frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

JWT_SECRET=localgig_secret_key_2026

MYSQLHOST=your_host
MYSQLUSER=your_user
MYSQLPASSWORD=your_password
MYSQLDATABASE=your_database
MYSQLPORT=3306
```

---

## Database Tables

The project uses the following MySQL tables:

* users
* gigs
* applications
* reviews
* reports

---

## Deployment Links

### Frontend

```bash
https://miniproject-q96a.vercel.app
```

### Backend API

```bash
https://localgig-backend.onrender.com
```

---

## Future Enhancements

* Real-time Chat System
* Payment Gateway Integration
* Email Notifications
* AI-based Gig Recommendations
* Mobile Application
* Advanced Admin Analytics

---

## GitHub Repository

```bash
https://github.com/sneha27042005/miniproject
```

---

## Author

**Sneha**
Mini Project – LocalGig Platform
