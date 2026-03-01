<![CDATA[# KRMU – Smart College Event & Attendance Management System

<p align="center">
  <img src="/krmu.webp" alt="KRMU Logo" width="120" />
</p>

<p align="center">
  <strong>A full-stack web application for digitizing college event management and attendance tracking at K.R. Mangalam University.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Educational-8B2332" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Security](#-security)
- [Demo Credentials](#-demo-credentials)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎓 Overview

**KRMU – Smart College Event & Attendance Management System** is a production-ready, full-stack web application built for K.R. Mangalam University. It replaces manual, paper-based event coordination with a centralized, role-based digital platform where faculty can create and manage events, mark attendance, and generate reports — while students can browse events, register, and track their participation history.

The system follows a **3-tier client-server architecture** with a React + TypeScript frontend, a Node.js + Express REST API backend, and a MongoDB Atlas cloud database.

---

## 🔍 Problem Statement

Traditional college event management suffers from:

| Problem | Impact |
|---------|--------|
| Paper-based sign-ups & attendance sheets | Data loss, inaccuracy, and manipulation |
| Email-based coordination | Slow communication, missed deadlines |
| No centralized data | Impossible to generate analytics or audit trails |
| Manual reporting | Faculty spend hours compiling attendance reports |

**This system solves all of the above** by providing a real-time, digital, role-based platform with automated email reporting and cloud-based data persistence.

---

## ✨ Key Features

### 👨‍🎓 For Students

| Feature | Description |
|---------|-------------|
| **Browse Events** | View all upcoming events with details (date, venue, capacity) |
| **One-Click Registration** | Register for events instantly with capacity checks |
| **Personal Dashboard** | Stats overview — registered events, attended events, upcoming events |
| **My Registrations** | Track all registrations and view attendance status |
| **Attendance History** | View past attendance records across all events |

### 👨‍🏫 For Faculty

| Feature | Description |
|---------|-------------|
| **Create Events** | Full event creation form with title, description, date, time, venue, capacity, and department |
| **Manage Events** | Edit, update, or delete events with cascading data cleanup |
| **View Registrations** | See all students registered for any event |
| **Mark Attendance** | Checkbox-based bulk attendance marking (Present / Absent) |
| **Lock Attendance** | Finalize attendance to prevent further changes |
| **Email Reports** | Automated CSV attendance reports sent via email (Gmail SMTP) |
| **Faculty Dashboard** | Stats overview — total events, registrations, attendance marked |

### 🛡️ General

- **Role-Based Access Control** — Separate dashboards and permissions for students and faculty
- **JWT Authentication** — Secure, stateless token-based authentication with 1-day expiry
- **Responsive Design** — Fully responsive UI across desktop, tablet, and mobile
- **Professional UI** — Clean, academic aesthetic with KRMU's maroon branding
- **Consistent REST API** — Standardized JSON response format with proper error handling
- **Cascading Deletes** — Deleting an event automatically removes related registrations and attendance

---

## 🏗️ Architecture

The system uses a **3-tier client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                            │
│              React 19 + TypeScript + Vite                       │
│              (Client-Side SPA — Port 5173)                      │
│                                                                 │
│   Landing Page → Auth Pages → Role-Based Dashboards             │
│   AuthContext (State) │ ProtectedRoutes │ Layout Components      │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP REST API (JSON)
                           │  Authorization: Bearer <JWT>
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│              Node.js + Express 5 (Port 3000)                    │
│                                                                 │
│   CORS → JSON Parser → JWT Auth Middleware → Route Handlers     │
│   /api/auth  │  /api/events  │  /api/registrations  │  /api/attendance │
│                                                                 │
│   Utility Layer: Nodemailer (Email Reports)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│              MongoDB Atlas (Cloud-Hosted)                       │
│                                                                 │
│   Users │ Events │ Registrations │ Attendance                   │
└─────────────────────────────────────────────────────────────────┘
```

> For the complete, in-depth architecture documentation, see [`KRMU_System_Architecture.md`](./KRMU_System_Architecture.md).

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | Component-based UI library |
| TypeScript | 5.9.3 | Static type checking |
| Vite | 7.2.4 | Build tool & dev server (HMR) |
| React Router DOM | 7.12.0 | Client-side routing |
| Lucide React | 0.562.0 | Icon library |
| date-fns | 4.1.0 | Date formatting & manipulation |
| ESLint | 9.39.1 | Code quality & linting |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | – | JavaScript runtime |
| Express.js | 5.2.1 | REST API framework |
| Mongoose | 9.2.1 | MongoDB ODM |
| bcryptjs | 3.0.3 | Password hashing (salted bcrypt) |
| jsonwebtoken | 9.0.3 | JWT generation & verification |
| cors | 2.8.6 | Cross-Origin Resource Sharing |
| dotenv | 17.3.1 | Environment variable management |
| Nodemailer | 8.0.1 | Email sending (Gmail SMTP) |
| Nodemon | 3.1.11 | Dev server auto-restart |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL document database |
| Mongoose ODM | Schema validation, relationships, middleware |

---

## 📁 Project Structure

```
krmu-event-management/
│
├── README.md                           # This file
├── KRMU_System_Architecture.md         # Detailed architecture documentation
├── .gitignore
│
├── backend/                            # Node.js + Express REST API
│   ├── .env                            # Environment variables (not committed)
│   ├── package.json
│   └── src/
│       ├── server.js                   # Express app entry point
│       ├── config/
│       │   └── db.js                   # MongoDB connection (Mongoose)
│       ├── middleware/
│       │   └── auth.js                 # JWT authentication middleware
│       ├── models/
│       │   ├── User.js                 # User schema (student / faculty)
│       │   ├── Event.js                # Event schema
│       │   ├── Registration.js         # Registration schema + virtual fields
│       │   └── Attendance.js           # Attendance schema
│       ├── routes/
│       │   ├── auth.routes.js          # Register, Login, Get Current User
│       │   ├── event.routes.js         # Event CRUD + registrations query
│       │   ├── registration.routes.js  # Student registration workflows
│       │   └── attendance.routes.js    # Attendance marking + email reports
│       └── utils/
│           └── sendEmail.js            # Nodemailer email utility
│
└── frontend/                           # React + TypeScript + Vite SPA
    ├── index.html                      # HTML entry point
    ├── vite.config.ts                  # Vite configuration
    ├── tsconfig.json                   # TypeScript config
    ├── eslint.config.js                # ESLint configuration
    ├── package.json
    ├── krmu.webp                       # App logo asset
    ├── public/                         # Static assets
    └── src/
        ├── main.tsx                    # React DOM root mount
        ├── App.tsx                     # Root component (providers + routing)
        ├── App.css                     # Global application styles
        ├── index.css                   # Design system / CSS variables
        ├── context/
        │   └── AuthContext.tsx          # Auth state management (Context API)
        ├── types/
        │   └── index.ts                # TypeScript type definitions
        ├── utils/
        │   └── storage.ts              # localStorage utility stubs
        ├── components/
        │   ├── Header/                 # Navigation header (role-aware)
        │   ├── Layout/                 # Page layout wrapper
        │   └── ProtectedRoute/         # Auth & role guard component
        └── pages/
            ├── Landing/                # Public landing page
            ├── Auth/                   # Login & Register pages
            ├── Student/
            │   ├── Dashboard/          # Student stats & overview
            │   ├── Events/             # Browse all events
            │   ├── EventDetails/       # Event info + register/cancel
            │   └── MyRegistrations/    # View registrations & attendance
            └── Faculty/
                ├── Dashboard/          # Faculty stats & overview
                ├── Events/             # Manage own events
                ├── CreateEvent/        # New event creation form
                └── EventDetails/       # Registrations + mark attendance
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **MongoDB Atlas** account — [Create free cluster](https://www.mongodb.com/atlas)
- **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) (for email reports)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/krmu-event-management.git
cd krmu-event-management
```

**2. Setup the Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below).

**3. Setup the Frontend**

```bash
cd ../frontend
npm install
```

### Running the Application

Open **two terminals** and run both servers simultaneously:

**Terminal 1 — Backend (API Server)**

```bash
cd backend
npm run dev
```

The Express server will start on **http://localhost:3000**.

**Terminal 2 — Frontend (Dev Server)**

```bash
cd frontend
npm run dev
```

The Vite dev server will start on **http://localhost:5173**.

**4. Open your browser and navigate to:**

```
http://localhost:5173
```

> **Note:** Both servers must be running simultaneously. The frontend communicates with the backend API at `http://localhost:3000/api`.

### Stopping the Servers

Press `Ctrl + C` in each terminal to stop the respective server.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: `3000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `EMAIL_USER` | Gmail address for sending attendance email reports |
| `EMAIL_PASS` | Gmail [App Password](https://support.google.com/accounts/answer/185833) (not your regular password) |

> ⚠️ **Important:** Never commit the `.env` file to version control. It is already listed in `.gitignore`.

---

## 📡 API Reference

**Base URL:** `http://localhost:3000/api`

All authenticated endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |

### Events — `/api/events`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/events` | ✅ Any | List all events (newest first) |
| `GET` | `/events/:id` | ✅ Any | Get single event by ID |
| `POST` | `/events` | ✅ Faculty | Create a new event |
| `PATCH` | `/events/:id` | ✅ Faculty (Owner) | Update event fields |
| `DELETE` | `/events/:id` | ✅ Faculty (Owner) | Delete event + cascading cleanup |
| `GET` | `/events/:id/registrations` | ✅ Any | Get all registrations for an event |

### Registrations — `/api/registrations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/registrations` | ✅ Student | Register for an event |
| `GET` | `/registrations/my` | ✅ Student | Get my registrations |
| `DELETE` | `/registrations/:eventId` | ✅ Student | Cancel a registration |

### Attendance — `/api/attendance`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/attendance/bulk` | ✅ Faculty | Bulk save/update attendance |
| `POST` | `/attendance/:eventId` | ✅ Faculty | Mark attendance for single event |
| `POST` | `/attendance/:eventId/email` | ✅ Faculty | Email attendance report to creator |
| `GET` | `/attendance/:eventId` | ✅ Any | Get attendance for an event |
| `GET` | `/attendance/my/records` | ✅ Student | Get my attendance records |

### Response Format

All endpoints return a consistent JSON structure:

```json
// ✅ Success
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}

// ❌ Error
{
  "success": false,
  "message": "Error description"
}
```

---

## 🗄️ Database Schema

The application uses **4 MongoDB collections** with Mongoose ODM:

### Users

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required (bcrypt hashed) |
| `role` | String | Required — `student` or `faculty` |
| `department` | String | Optional |
| `rollNumber` | String | Optional (students) |
| `employeeId` | String | Optional (faculty) |

### Events

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Required |
| `description` | String | Optional |
| `date` | String | Optional |
| `time` | String | Optional |
| `venue` | String | Optional |
| `capacity` | Number | Optional (null = unlimited) |
| `department` | String | Default: `"General"` |
| `isAttendanceLocked` | Boolean | Default: `false` |
| `createdBy` | ObjectId | Ref → Users (faculty) |

### Registrations

| Field | Type | Constraints |
|-------|------|-------------|
| `eventId` | ObjectId | Required, Ref → Events |
| `studentId` | ObjectId | Required, Ref → Users |

### Attendance

| Field | Type | Constraints |
|-------|------|-------------|
| `eventId` | ObjectId | Ref → Events |
| `studentId` | ObjectId | Ref → Users |
| `status` | String | `Present` or `Absent` (Default: `Absent`) |

### Entity Relationships

```
Users (1) ──── creates ────► Events (Many)
Users (1) ──── registers ──► Registrations (Many) ◄── belongs to ── Events (1)
Users (1) ──── has ────────► Attendance (Many)    ◄── belongs to ── Events (1)
```

---

## 🔒 Authentication & Authorization

### Authentication Flow

1. User submits credentials via `POST /api/auth/login`
2. Server validates email/password against MongoDB (bcrypt comparison)
3. Server signs a JWT with `{ id, role }` payload (1-day expiry)
4. Client stores the token in `localStorage` and includes it as `Bearer <token>` in all subsequent requests
5. `auth.js` middleware verifies the token on every protected route

### Authorization Matrix

| Action | Student | Faculty | Owner Only |
|--------|:-------:|:-------:|:----------:|
| Register / Login | ✅ | ✅ | – |
| View Events | ✅ | ✅ | – |
| Create Event | ❌ | ✅ | – |
| Update / Delete Event | ❌ | ✅ | ✅ |
| Register for Event | ✅ | ❌ | – |
| Cancel Registration | ✅ | ❌ | – |
| Mark Attendance | ❌ | ✅ | – |
| Send Email Report | ❌ | ✅ | – |
| View Attendance | ✅ | ✅ | – |

### Security Layers

| Layer | Measure | Details |
|-------|---------|---------|
| Passwords | bcrypt hashing | Salt rounds: 10 |
| Auth | JWT tokens | 1-day expiry, Bearer scheme |
| Routes | Middleware protection | `auth.js` on all protected endpoints |
| Roles | RBAC | Faculty-only / Student-only checks |
| Ownership | Creator verification | Only event creator can update/delete |
| CORS | Origin whitelist | Development ports only |
| Payload | Size limit | JSON body capped at 10MB |
| Errors | Centralized handler | Stack traces never leaked to client |

---

## 🎯 Demo Credentials

The application comes with pre-configured demo accounts (if seeded):

| Role | Email | Password |
|------|-------|----------|
| **Faculty** | `faculty@krmu.edu.in` | `faculty123` |
| **Student** | `student@krmu.edu.in` | `student123` |

### Quick Start Guide

**As Faculty:**
1. Login with faculty credentials
2. Navigate to **Events** → Click **Create Event**
3. Fill in event details and submit
4. View your event → Switch to **Mark Attendance** tab
5. Toggle Present/Absent for each student → **Save Attendance**
6. Click **Lock Attendance** when finalized
7. Click **Send Email Report** to receive CSV via email

**As Student:**
1. Login with student credentials (or register a new account)
2. Browse **Events** to see all available events
3. Click on any event → Click **Register Now**
4. View your registrations in **My Registrations**
5. Check attendance status after the event concludes

---

## 📝 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Express server with Nodemon (auto-restart) on port 3000 |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run build` | TypeScript type-check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## 🎨 Design & Theme

The application uses a professional academic color scheme inspired by K.R. Mangalam University:

| Color | Hex | Usage |
|-------|-----|-------|
| **Maroon** | `#8B2332` | Primary brand color, buttons, headers |
| **Cream** | `#F5F1E8` | Secondary backgrounds |
| **White** | `#FFFFFF` | Main background |
| **Dark Text** | `#1a1a1a` | Primary body text |
| **Gray** | `#64748b` | Secondary / muted text |

### Responsive Design

The UI is fully responsive across:
- **Desktop** — Full navigation bar and multi-column layouts
- **Tablet** — Adapted layouts with touch-friendly elements
- **Mobile** — Hamburger menu and stacked layouts

---

## 🧪 Testing the Application

1. **Faculty Flow** — Register/login as faculty → Create an event → View registrations → Mark attendance → Lock → Email report
2. **Student Flow** — Register/login as student → Browse events → Register for an event → View in My Registrations → Check attendance
3. **Edge Cases** — Duplicate registration prevention, capacity limits, locked attendance cancellation block, owner-only edit/delete

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-feature`
3. **Commit** your changes: `git commit -m "Add some feature"`
4. **Push** to the branch: `git push origin feature/my-new-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and project structure
- Use TypeScript for all frontend code
- Add proper error handling for new API endpoints
- Test both student and faculty flows after changes

---

## 📄 License

This project is developed for **educational purposes** as part of the Minor Project II coursework at **K.R. Mangalam University, Semester 4**.

---

## 📚 Additional Documentation

- **[System Architecture Document](./KRMU_System_Architecture.md)** — In-depth 900+ line architectural reference covering frontend/backend architecture, data flow diagrams, security analysis, deployment setup, and complete API specifications.

---

<p align="center">
  <strong>Built with ❤️ for K.R. Mangalam University</strong>
  <br />
  <em>KRMU – Smart College Event & Attendance Management System</em>
</p>
]]>
