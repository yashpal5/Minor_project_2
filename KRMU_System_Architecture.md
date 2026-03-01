# KRMU – Smart College Event & Attendance Management System

## Complete System Architecture Document

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Architecture](#6-database-architecture)
7. [API Architecture](#7-api-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [Security Architecture](#10-security-architecture)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Directory Structure](#12-directory-structure)
13. [Conclusion](#13-conclusion)

---

## 1. Project Overview

**KRMU – Smart College Event & Attendance Management System** is a full-stack web application designed to digitize and streamline college event management and attendance tracking at K.R. Mangalam University. The system serves two primary user roles — **Students** and **Faculty** — and provides role-based dashboards, event CRUD operations, registration workflows, attendance marking, and automated email reporting.

### 1.1 Problem Statement

Traditional college event management relies on manual processes: paper-based sign-ups, physical attendance sheets, and email-based coordination. This leads to:
- Inefficient event promotion and registration
- Inaccurate or lost attendance records
- No centralized data for analytics or reporting
- Poor communication between faculty event organizers and students

### 1.2 Solution

This system provides a centralized, role-based web platform where:
- **Faculty** can create and manage events, mark attendance, lock attendance records, and receive automated email reports.
- **Students** can browse events, register/cancel registrations, and view their attendance history.
- **All data** is stored in a cloud MongoDB database, ensuring persistence and scalability.

---

## 2. High-Level Architecture

The system follows a **3-tier client-server architecture** with clear separation between the Presentation, Application, and Data layers.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                                │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │              PRESENTATION LAYER (Frontend)                  │   │
│   │         React 19 + TypeScript + Vite (Port 5173)            │   │
│   │                                                             │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │   │
│   │  │  Landing  │  │   Auth   │  │   Role-Based Dashboards  │  │   │
│   │  │   Page    │  │  Pages   │  │   (Student / Faculty)    │  │   │
│   │  └──────────┘  └──────────┘  └──────────────────────────┘  │   │
│   │                                                             │   │
│   │  ┌──────────────┐  ┌────────────┐  ┌────────────────────┐  │   │
│   │  │ AuthContext   │  │ Protected  │  │  Layout + Header   │  │   │
│   │  │ (State Mgmt)  │  │  Routes    │  │   Components       │  │   │
│   │  └──────────────┘  └────────────┘  └────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                         │                                           │
│                         │  HTTP REST API (JSON)                     │
│                         │  Authorization: Bearer <JWT>              │
│                         ▼                                           │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          │  CORS-Enabled HTTP Requests
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER (Backend)                        │
│              Node.js + Express.js (Port 3000)                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Express Middleware Pipeline               │   │
│  │  cors() → express.json() → auth.js (JWT) → Route Handlers   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐  │
│  │ Auth Routes  │ │ Event Routes │ │ Registration │ │ Attendance│  │
│  │ /api/auth/*  │ │ /api/events/*│ │  /api/       │ │ /api/     │  │
│  │              │ │              │ │registrations/│ │attendance/│  │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └─────┬─────┘  │
│         │                │                │               │         │
│  ┌──────┴────────────────┴────────────────┴───────────────┴──────┐  │
│  │                      Utility Layer                            │  │
│  │              sendEmail.js (Nodemailer)                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                          │
│                          │  Mongoose ODM                            │
│                          ▼                                          │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (Database)                          │
│              MongoDB Atlas (Cloud-Hosted Cluster)                   │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  ┌───────────┐ │
│  │   Users    │  │   Events   │  │ Registrations │  │ Attendance│ │
│  │ Collection │  │ Collection │  │  Collection   │  │ Collection│ │
│  └────────────┘  └────────────┘  └───────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend

| Technology        | Version  | Purpose                                      |
|-------------------|----------|----------------------------------------------|
| React             | 19.2.0   | UI library for building component-based interfaces |
| TypeScript        | 5.9.3    | Static type checking for JavaScript          |
| Vite              | 7.2.4    | Build tool and dev server (HMR, fast builds) |
| React Router DOM  | 7.12.0   | Client-side routing and navigation           |
| Lucide React      | 0.562.0  | Icon library for UI elements                 |
| date-fns          | 4.1.0    | Date formatting and manipulation             |
| uuid              | 13.0.0   | Unique ID generation                         |
| ESLint            | 9.39.1   | Code linting and quality enforcement         |

### 3.2 Backend

| Technology   | Version | Purpose                                   |
|--------------|---------|-------------------------------------------|
| Node.js      | –       | JavaScript runtime environment            |
| Express.js   | 5.2.1   | Web framework for REST API                |
| Mongoose     | 9.2.1   | MongoDB ODM (Object Document Mapper)      |
| bcryptjs     | 3.0.3   | Password hashing (salted bcrypt)          |
| jsonwebtoken | 9.0.3   | JWT generation and verification           |
| cors         | 2.8.6   | Cross-Origin Resource Sharing middleware  |
| dotenv       | 17.3.1  | Environment variable management           |
| nodemailer   | 8.0.1   | Email sending (SMTP via Gmail)            |
| nodemon      | 3.1.11  | Dev server auto-restart on file changes   |

### 3.3 Database

| Technology    | Purpose                                      |
|---------------|----------------------------------------------|
| MongoDB Atlas | Cloud-hosted NoSQL document database         |
| Mongoose ODM  | Schema validation, relationships, middleware |

---

## 4. Frontend Architecture

### 4.1 Entry Point & Application Bootstrap

```
index.html
  └── main.tsx           (React DOM root mount)
        └── App.tsx      (AuthProvider → Router → Routes)
```

**`main.tsx`** renders the root `<App />` component into the DOM.

**`App.tsx`** wraps the entire application in:
1. **`<AuthProvider>`** — Global authentication state via React Context
2. **`<BrowserRouter>`** — Client-side routing
3. **`<Routes>`** — Route definitions with role-based protection

### 4.2 Routing Architecture

```
/                          → RootRedirect (Landing or Dashboard based on auth)
/login                     → LoginPage (public)
/register                  → RegisterPage (public)

/student/dashboard         → StudentDashboard (protected: student only)
/student/events            → StudentEvents (protected: student only)
/student/events/:eventId   → EventDetails (protected: student only)
/student/my-registrations  → MyRegistrations (protected: student only)

/faculty/dashboard         → FacultyDashboard (protected: faculty only)
/faculty/events            → FacultyEvents (protected: faculty only)
/faculty/create-event      → CreateEvent (protected: faculty only)
/faculty/events/:eventId   → FacultyEventDetails (protected: faculty only)

*                          → Redirect to / (catch-all)
```

### 4.3 Component Architecture

```
src/
├── components/                       # Shared / Reusable Components
│   ├── Header/
│   │   ├── Header.tsx                # Navigation bar with role-based menu items
│   │   ├── Header.css                # Header styling
│   │   └── index.ts                  # Barrel export
│   │
│   ├── Layout/
│   │   ├── Layout.tsx                # Main page layout wrapper (Header + <Outlet/>)
│   │   ├── Layout.css                # Layout styling
│   │   └── index.ts                  # Barrel export
│   │
│   └── ProtectedRoute/
│       ├── ProtectedRoute.tsx        # Auth guard — checks JWT + role before rendering
│       └── index.ts                  # Barrel export
│
├── context/
│   └── AuthContext.tsx               # Global auth state (user, login, register, logout)
│
├── types/
│   └── index.ts                      # TypeScript interfaces (User, Event, Registration, etc.)
│
├── utils/
│   └── storage.ts                    # Disabled local storage stubs (all calls throw errors)
│
├── pages/                            # Feature Pages (grouped by role)
│   ├── Landing/
│   │   ├── LandingPage.tsx           # Public landing page with hero, features, CTA
│   │   └── LandingPage.css
│   │
│   ├── Auth/
│   │   ├── LoginPage.tsx             # Email + password login form
│   │   ├── RegisterPage.tsx          # Multi-field registration form (role-aware)
│   │   └── Auth.css
│   │
│   ├── Student/
│   │   ├── Dashboard/                # Student overview: stats, upcoming events
│   │   ├── Events/                   # Browse all available events
│   │   ├── EventDetails/             # View event info + register/cancel
│   │   └── MyRegistrations/          # View registered events and attendance status
│   │
│   └── Faculty/
│       ├── Dashboard/                # Faculty overview: stats, my events summary
│       ├── Events/                   # View and manage own events
│       ├── CreateEvent/              # Form to create a new event
│       └── EventDetails/             # View event registrations + mark attendance
│
├── App.tsx                           # Root component (routing + providers)
├── App.css                           # Global app styles
├── index.css                         # Base design system / CSS variables
└── main.tsx                          # React DOM entry point
```

### 4.4 State Management

The application uses **React Context API** for global authentication state:

```
AuthContext.tsx
├── State:
│   ├── user: User | null           (current logged-in user object)
│   └── isLoading: boolean          (loading state during auth operations)
│
├── Actions:
│   ├── login(email, password)      → POST /api/auth/login → stores JWT + user
│   ├── register(userData)          → POST /api/auth/register → returns success/fail
│   └── logout()                    → clears localStorage (token + user) → sets user null
│
└── Persistence:
    ├── Token stored in localStorage("token")
    └── User object stored in localStorage("user")
```

**Local component state** (`useState`, `useEffect`) manages page-level data like event lists, registration status, and attendance records by calling the backend API directly via `fetch()`.

### 4.5 Frontend ↔ Backend Communication

All API calls use the browser's native **`fetch()` API**:
- Base URL: `http://localhost:3000/api`
- Authorization: `Bearer <JWT>` header on every authenticated request
- Content-Type: `application/json`
- Token is retrieved from `localStorage` before each protected API call

### 4.6 Type System

TypeScript interfaces enforce type safety across the application:

| Interface         | Fields                                                                                |
|-------------------|---------------------------------------------------------------------------------------|
| `User`            | id, email, password, name, role, department?, rollNumber?, employeeId?, createdAt      |
| `UserRole`        | `'student' \| 'faculty'`                                                              |
| `Event`           | id, title, description, date, time, venue, capacity?, createdBy, createdByName, department, createdAt, isAttendanceLocked |
| `Registration`    | id, eventId, studentId, studentName, studentEmail, studentRollNumber, registeredAt     |
| `Attendance`      | id, eventId, studentId, studentName, studentRollNumber, status, markedAt, markedBy     |
| `AttendanceStatus`| `'present' \| 'absent' \| 'not_marked'`                                               |
| `EmailLog`        | id, eventId, eventTitle, sentTo, sentAt, status, reportType                            |
| `FacultyStats`    | totalEvents, totalRegistrations, totalAttendanceMarked, upcomingEvents                 |
| `StudentStats`    | registeredEvents, attendedEvents, upcomingRegisteredEvents                             |
| `AuthContextType` | user, login(), register(), logout(), isLoading                                         |

---

## 5. Backend Architecture

### 5.1 Server Setup (`server.js`)

The Express application is configured with the following middleware pipeline:

```
Incoming Request
    │
    ├── 1. CORS Middleware
    │       Allowed Origins: localhost:5173, localhost:5174, localhost:3001
    │       Credentials: enabled
    │
    ├── 2. JSON Body Parser
    │       Limit: 10MB payload
    │
    ├── 3. Route Matching
    │       /api/auth/*          → auth.routes.js
    │       /api/events/*        → event.routes.js
    │       /api/attendance/*    → attendance.routes.js
    │       /api/registrations/* → registration.routes.js
    │
    ├── 4. Centralized Error Handler
    │       Catches unhandled errors → returns 500 JSON response
    │
    └── 5. 404 Handler
            Catches unmatched routes → returns 404 JSON response
```

### 5.2 Modular Architecture

```
backend/
├── src/
│   ├── server.js                # Express app setup, middleware, route mounting
│   │
│   ├── config/
│   │   └── db.js                # MongoDB connection via Mongoose (uses MONGO_URI env var)
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   │                             # Extracts token from "Authorization: Bearer <token>"
│   │                             # Verifies with JWT_SECRET → attaches req.user = { id, role }
│   │
│   ├── models/                  # Mongoose Schemas & Models
│   │   ├── User.js              # Users (name, email, password, role, department, etc.)
│   │   ├── Event.js             # Events (title, date, venue, capacity, createdBy, etc.)
│   │   ├── Registration.js      # Event registrations (eventId ↔ studentId mapping)
│   │   └── Attendance.js        # Attendance records (eventId, studentId, status)
│   │
│   ├── routes/                  # Express Router files (contain business logic inline)
│   │   ├── auth.routes.js       # Register, Login, Get Current User
│   │   ├── event.routes.js      # CRUD events, get registrations per event
│   │   ├── registration.routes.js # Student register/cancel, get my registrations
│   │   └── attendance.routes.js # Save attendance (bulk/single), email report
│   │
│   └── utils/
│       └── sendEmail.js         # Nodemailer utility for attendance email reports
│
├── .env                         # Environment variables (PORT, MONGO_URI, JWT_SECRET, EMAIL_*)
├── package.json                 # Dependencies & scripts
└── .gitignore
```

### 5.3 Environment Configuration

| Variable       | Description                                        |
|----------------|----------------------------------------------------|
| `PORT`         | Server port (default: 3000)                        |
| `MONGO_URI`    | MongoDB Atlas connection string                    |
| `JWT_SECRET`   | Secret key for signing/verifying JWT tokens        |
| `EMAIL_USER`   | Gmail address for sending attendance email reports |
| `EMAIL_PASS`   | Gmail app-specific password                        |

---

## 6. Database Architecture

### 6.1 Database: MongoDB Atlas

The application uses **MongoDB Atlas** (cloud-hosted) with **Mongoose ODM** for schema enforcement and data relationships.

### 6.2 Collection Schemas

#### Users Collection

| Field        | Type     | Constraints                     | Description                     |
|--------------|----------|----------------------------------|---------------------------------|
| `_id`        | ObjectId | Auto-generated                  | Primary key                     |
| `name`       | String   | Required                        | Full name                       |
| `email`      | String   | Required, Unique                | Login email                     |
| `password`   | String   | Required                        | bcrypt-hashed password          |
| `role`       | String   | Required, Enum: student/faculty | Access control role             |
| `department` | String   | Optional                        | Department (e.g., "CSE")        |
| `rollNumber` | String   | Optional                        | Student roll number             |
| `employeeId` | String   | Optional                        | Faculty employee ID             |
| `createdAt`  | Date     | Auto (timestamps: true)         | Account creation timestamp      |
| `updatedAt`  | Date     | Auto (timestamps: true)         | Last update timestamp           |

#### Events Collection

| Field               | Type     | Constraints            | Description                              |
|---------------------|----------|------------------------|------------------------------------------|
| `_id`               | ObjectId | Auto-generated         | Primary key                              |
| `title`             | String   | Required               | Event name                               |
| `description`       | String   | Optional               | Event details                            |
| `date`              | String   | Optional               | Event date                               |
| `time`              | String   | Optional               | Event time                               |
| `venue`             | String   | Optional               | Event location                           |
| `capacity`          | Number   | Optional               | Max attendees (null = unlimited)         |
| `department`        | String   | Default: "General"     | Target department                        |
| `isAttendanceLocked`| Boolean  | Default: false         | If true, students cannot cancel registration |
| `createdBy`         | ObjectId | Ref → Users            | Faculty who created the event            |
| `createdAt`         | Date     | Auto                   | Creation timestamp                       |
| `updatedAt`         | Date     | Auto                   | Last update timestamp                    |

#### Registrations Collection

| Field        | Type     | Constraints    | Description                       |
|--------------|----------|----------------|-----------------------------------|
| `_id`        | ObjectId | Auto-generated | Primary key                       |
| `eventId`    | ObjectId | Required, Ref → Events | Event being registered for |
| `studentId`  | ObjectId | Required, Ref → Users  | Student who registered     |
| `createdAt`  | Date     | Auto           | Registration timestamp (aliased as `registeredAt` in JSON) |
| `updatedAt`  | Date     | Auto           | Last update timestamp             |

> **Virtual Field:** `registeredAt` — aliased from `createdAt` in JSON serialization for frontend compatibility.

#### Attendance Collection

| Field       | Type     | Constraints               | Description                     |
|-------------|----------|---------------------------|---------------------------------|
| `_id`       | ObjectId | Auto-generated            | Primary key                     |
| `eventId`   | ObjectId | Ref → Events              | Associated event                |
| `studentId` | ObjectId | Ref → Users               | Student being marked            |
| `status`    | String   | Enum: Present/Absent, Default: Absent | Attendance status    |
| `createdAt` | Date     | Auto                      | Record creation timestamp       |
| `updatedAt` | Date     | Auto                      | Last update timestamp           |

### 6.3 Entity Relationship Diagram

```
┌──────────────┐          ┌──────────────────┐          ┌──────────────┐
│    USERS     │          │  REGISTRATIONS   │          │    EVENTS    │
├──────────────┤          ├──────────────────┤          ├──────────────┤
│ _id (PK)     │◄─────────│ studentId (FK)   │          │ _id (PK)     │
│ name         │          │ eventId (FK)     │─────────►│ title        │
│ email        │          │ createdAt        │          │ description  │
│ password     │          └──────────────────┘          │ date / time  │
│ role         │                                        │ venue        │
│ department   │          ┌──────────────────┐          │ capacity     │
│ rollNumber   │          │   ATTENDANCE     │          │ department   │
│ employeeId   │          ├──────────────────┤          │ isAttLocked  │
│              │◄─────────│ studentId (FK)   │          │ createdBy(FK)│◄─┐
└──────────────┘          │ eventId (FK)     │─────────►└──────────────┘  │
       │                  │ status           │                            │
       │                  └──────────────────┘                            │
       │                                                                  │
       └─────────────────── (Faculty creates Events) ─────────────────────┘
```

**Relationships:**
- **User (1) → Event (Many):** A faculty user can create multiple events (`createdBy` reference).
- **User (1) → Registration (Many):** A student can register for multiple events.
- **Event (1) → Registration (Many):** An event can have multiple registrations.
- **User (1) → Attendance (Many):** A student can have multiple attendance records.
- **Event (1) → Attendance (Many):** An event can have multiple attendance entries.

---

## 7. API Architecture

### 7.1 API Base URL

```
http://localhost:3000/api
```

### 7.2 Authentication Endpoints (`/api/auth`)

| Method | Endpoint        | Auth Required | Description                    | Request Body                           | Response                               |
|--------|-----------------|---------------|--------------------------------|----------------------------------------|----------------------------------------|
| POST   | `/auth/register`| No            | Register a new user            | `{ name, email, password, role, department?, rollNumber?, employeeId? }` | `{ success, message }`  |
| POST   | `/auth/login`   | No            | Log in and receive JWT         | `{ email, password }`                  | `{ success, token, user: {...} }`      |
| GET    | `/auth/me`      | Yes (any)     | Get current user from token    | –                                      | `{ success, user: {...} }`             |

### 7.3 Event Endpoints (`/api/events`)

| Method | Endpoint                   | Auth Required    | Description                       | Request Body                              |
|--------|----------------------------|------------------|-----------------------------------|-------------------------------------------|
| GET    | `/events`                  | Yes (any)        | List all events (sorted newest)   | –                                         |
| GET    | `/events/:id`              | Yes (any)        | Get single event by ID            | –                                         |
| POST   | `/events`                  | Yes (faculty)    | Create a new event                | `{ title, description, date, time, venue, capacity?, department? }` |
| PATCH  | `/events/:id`              | Yes (faculty, owner) | Update event fields           | Partial: `{ title?, description?, date?, isAttendanceLocked?, ... }` |
| DELETE | `/events/:id`              | Yes (faculty, owner) | Delete event + related data   | –                                         |
| GET    | `/events/:id/registrations`| Yes (any)        | Get all registrations for event   | –                                         |

> **Note:** DELETE also cascades: removes all related `Registration` and `Attendance` documents.

### 7.4 Registration Endpoints (`/api/registrations`)

| Method | Endpoint               | Auth Required     | Description                      | Request Body     |
|--------|------------------------|-------------------|----------------------------------|------------------|
| POST   | `/registrations`       | Yes (student)     | Register for an event            | `{ eventId }`    |
| GET    | `/registrations/my`    | Yes (student)     | Get my registrations             | –                |
| DELETE | `/registrations/:eventId` | Yes (student)  | Cancel a registration            | –                |

> **Business Rules:**
> - Duplicate registration check (same student + event)
> - Capacity check before allowing registration
> - Cannot cancel if event attendance is locked

### 7.5 Attendance Endpoints (`/api/attendance`)

| Method | Endpoint                     | Auth Required    | Description                         | Request Body                        |
|--------|------------------------------|------------------|-------------------------------------|-------------------------------------|
| POST   | `/attendance/bulk`           | Yes (faculty)    | Bulk save/update attendance         | `[{ eventId, studentId, status }]`  |
| POST   | `/attendance/:eventId`       | Yes (faculty)    | Mark attendance for single event    | `{ attendance: [{ studentId, status }] }` |
| POST   | `/attendance/:eventId/email` | Yes (faculty)    | Email attendance report to creator  | –                                   |
| GET    | `/attendance/:eventId`       | Yes (any)        | Get attendance for an event         | –                                   |
| GET    | `/attendance/my/records`     | Yes (student)    | Get my attendance records           | –                                   |

> **Status Normalization:** The bulk endpoint normalizes lowercase `"present"/"absent"` to title-case `"Present"/"Absent"` for DB consistency. The GET endpoints return lowercase for frontend compatibility.

### 7.6 Response Format

All API responses follow a consistent JSON structure:

```json
// Success
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }         // optional, varies by endpoint
}

// Error
{
  "success": false,
  "message": "Error description"
}
```

---

## 8. Authentication & Authorization

### 8.1 Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  POST /api/auth/login         │                               │
     │  { email, password }          │                               │
     │──────────────────────────────►│                               │
     │                               │  findOne({ email })           │
     │                               │──────────────────────────────►│
     │                               │                               │
     │                               │◄──────────────────────────────│
     │                               │  User document                │
     │                               │                               │
     │                               │  bcrypt.compare(password)     │
     │                               │  jwt.sign({ id, role })       │
     │                               │                               │
     │  { success, token, user }     │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  Store token + user in        │                               │
     │  localStorage                 │                               │
     │                               │                               │
     │  GET /api/events              │                               │
     │  Header: Authorization:       │                               │
     │  Bearer <JWT>                 │                               │
     │──────────────────────────────►│                               │
     │                               │  jwt.verify(token)            │
     │                               │  req.user = { id, role }      │
     │                               │  → Route Handler              │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │  [events array]               │                               │
     │◄──────────────────────────────│                               │
```

### 8.2 JWT Token Structure

```json
{
  "id": "MongoDB ObjectId of user",
  "role": "student | faculty",
  "iat": 1234567890,      // Issued at
  "exp": 1234654290       // Expires in 1 day
}
```

### 8.3 Authorization Matrix

| Action                     | Student | Faculty | Owner Only |
|----------------------------|---------|---------|------------|
| Register / Login           | ✅       | ✅       | –          |
| View Events                | ✅       | ✅       | –          |
| Create Event               | ❌       | ✅       | –          |
| Update Event               | ❌       | ✅       | ✅          |
| Delete Event               | ❌       | ✅       | ✅          |
| Register for Event         | ✅       | ❌       | –          |
| Cancel Registration        | ✅       | ❌       | –          |
| View Event Registrations   | ✅       | ✅       | –          |
| Mark Attendance            | ❌       | ✅       | –          |
| View Attendance            | ✅       | ✅       | –          |
| Send Email Report          | ❌       | ✅       | –          |

### 8.4 Auth Middleware (`auth.js`)

1. Extract token from `Authorization: Bearer <token>` header
2. Verify token against `JWT_SECRET` environment variable
3. Decode payload → attach `{ id, role }` to `req.user`
4. If invalid or missing → return `401 Unauthorized`

### 8.5 Role-Based Access Control

- **Frontend:** `<ProtectedRoute allowedRoles={['student'|'faculty']}>` checks `user.role` from `AuthContext`. Redirects unauthenticated or unauthorized users.
- **Backend:** Route handlers check `req.user.role` inline (e.g., `if (req.user.role !== "faculty") return 403`).
- **Owner checks:** For update/delete operations, the handler verifies `event.createdBy === req.user.id`.

---

## 9. Data Flow Diagrams

### 9.1 Student Registers for an Event

```
1. Student clicks "Register" button on EventDetails page
2. Frontend sends:  POST /api/registrations  { eventId }
                    Header: Authorization: Bearer <JWT>
3. auth.js middleware verifies JWT → req.user = { id, role: "student" }
4. Route handler checks:
   a. Role === "student"? ✅
   b. Event exists? ✅
   c. Already registered? ❌ (no duplicate)
   d. Capacity available? ✅
5. Registration.create({ eventId, studentId: req.user.id })
6. MongoDB saves document to Registrations collection
7. Response: { success: true, message: "Registered successfully" }
8. Frontend UI updates to show "Registered ✓"
```

### 9.2 Faculty Marks Attendance

```
1. Faculty navigates to EventDetails page → sees registered students list
2. Faculty toggles Present/Absent for each student
3. Frontend sends:  POST /api/attendance/bulk
                    Body: [{ eventId, studentId, status: "present" }, ...]
4. auth.js verifies JWT → req.user = { id, role: "faculty" }
5. Route handler iterates entries:
   a. Normalizes status: "present" → "Present"
   b. Upserts (findOneAndUpdate with upsert: true)
6. MongoDB creates/updates Attendance documents
7. Response: { success: true, message: "Attendance saved successfully" }
8. Frontend refreshes attendance state
```

### 9.3 Faculty Sends Attendance Email Report

```
1. Faculty clicks "Send Email Report" on event details
2. Frontend sends:  POST /api/attendance/:eventId/email
3. Backend calls sendAttendanceEmail(eventId):
   a. Fetch event with populated createdBy (faculty info)
   b. Fetch all Attendance entries for event with populated studentId
   c. Generate CSV: "Name,Roll Number,Status"
   d. Send via Nodemailer (Gmail SMTP) to faculty's email
4. Response: { success: true, message: "Attendance report sent via email" }
```

### 9.4 Complete Request Lifecycle

```
Browser                  Express Server               MongoDB
  │                           │                           │
  │  HTTP Request             │                           │
  ├──────────────────────────►│                           │
  │                           │                           │
  │                    ┌──────┴──────┐                    │
  │                    │ CORS Check  │                    │
  │                    └──────┬──────┘                    │
  │                    ┌──────┴──────┐                    │
  │                    │ JSON Parse  │                    │
  │                    └──────┬──────┘                    │
  │                    ┌──────┴──────┐                    │
  │                    │ Route Match │                    │
  │                    └──────┬──────┘                    │
  │                    ┌──────┴──────┐                    │
  │                    │ Auth Verify │                    │
  │                    │ (if needed) │                    │
  │                    └──────┬──────┘                    │
  │                    ┌──────┴──────┐                    │
  │                    │ Role Check  │                    │
  │                    │ (if needed) │                    │
  │                    └──────┬──────┘                    │
  │                    ┌──────┴──────┐                    │
  │                    │ Validation  │                    │
  │                    └──────┬──────┘                    │
  │                           │  Mongoose Query           │
  │                           ├──────────────────────────►│
  │                           │                           │
  │                           │◄──────────────────────────┤
  │                           │  Documents                │
  │                    ┌──────┴──────┐                    │
  │                    │  Transform  │                    │
  │                    │  & Format   │                    │
  │                    └──────┬──────┘                    │
  │  JSON Response            │                           │
  │◄──────────────────────────┤                           │
  │                           │                           │
```

---

## 10. Security Architecture

### 10.1 Security Measures Implemented

| Layer          | Measure                    | Details                                                   |
|----------------|----------------------------|-----------------------------------------------------------|
| **Passwords**  | bcrypt hashing             | Salt rounds: 10; passwords never stored in plaintext      |
| **Auth**       | JWT tokens                 | Signed with secret key; 1-day expiry; Bearer token scheme |
| **Routes**     | Middleware protection       | `auth.js` on all protected endpoints                      |
| **Roles**      | RBAC (inline checks)       | Faculty-only and student-only route checks                |
| **Ownership**  | Creator verification       | Only event creator can update/delete their event          |
| **Input**      | Field validation            | Required field checks; enum validation on roles/status    |
| **CORS**       | Origin whitelist            | Only localhost dev ports allowed                          |
| **Payload**    | Size limit                 | JSON body limited to 10MB                                 |
| **Errors**     | Centralized handler         | Internal errors don't leak stack traces to client         |
| **Frontend**   | ProtectedRoute component   | Client-side route guards based on role                    |

### 10.2 Security Architecture Diagram

```
               ┌─────────────────────────────┐
               │      Security Layers         │
               ├─────────────────────────────┤
               │  1. CORS Origin Whitelist    │  ← Network Layer
               │  2. JSON Payload Size Limit  │  ← Transport Layer
               │  3. JWT Token Verification   │  ← Authentication
               │  4. Role-Based Access Check  │  ← Authorization
               │  5. Owner Verification       │  ← Resource Ownership
               │  6. Input Validation         │  ← Business Rules
               │  7. bcrypt Password Hashing  │  ← Data Protection
               │  8. Error Message Sanitizing │  ← Information Hiding
               └─────────────────────────────┘
```

---

## 11. Deployment Architecture

### 11.1 Development Environment

```
┌────────────────────────────┐     ┌────────────────────────────┐
│  Frontend Dev Server       │     │  Backend Dev Server        │
│  Vite (localhost:5173)     │────►│  Nodemon (localhost:3000)  │
│  HMR enabled               │     │  Auto-restart on change    │
└────────────────────────────┘     └─────────────┬──────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │  MongoDB Atlas             │
                                   │  (Cloud Database)          │
                                   └────────────────────────────┘
```

### 11.2 Running the Project

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev          # Starts nodemon on port 3000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev          # Starts Vite dev server on port 5173
```

### 11.3 Scripts

| Script          | Location | Command                  | Purpose                           |
|-----------------|----------|--------------------------|-----------------------------------|
| `npm run dev`   | Backend  | `npx nodemon src/server.js` | Start Express with auto-reload |
| `npm run dev`   | Frontend | `vite`                   | Start Vite dev server with HMR    |
| `npm run build` | Frontend | `tsc -b && vite build`   | TypeScript check + production build |
| `npm run lint`  | Frontend | `eslint .`               | Run ESLint on all source files    |
| `npm run preview`| Frontend | `vite preview`          | Preview production build locally  |

---

## 12. Directory Structure

### 12.1 Complete Project Tree

```
krmu-event-management/
│
├── KRMU_System_Architecture.md       # This document
├── .gitignore
│
├── backend/                          # Node.js + Express REST API
│   ├── .env                          # Environment variables
│   ├── .gitignore
│   ├── package.json                  # Backend dependencies & scripts
│   ├── package-lock.json
│   └── src/
│       ├── server.js                 # Express app entry point
│       ├── config/
│       │   └── db.js                 # MongoDB connection (Mongoose)
│       ├── middleware/
│       │   └── auth.js               # JWT authentication middleware
│       ├── models/
│       │   ├── User.js               # User schema
│       │   ├── Event.js              # Event schema
│       │   ├── Registration.js       # Registration schema + virtual
│       │   └── Attendance.js         # Attendance schema
│       ├── routes/
│       │   ├── auth.routes.js        # Auth endpoints (register, login, me)
│       │   ├── event.routes.js       # Event CRUD + registrations query
│       │   ├── registration.routes.js# Student registration workflows
│       │   └── attendance.routes.js  # Attendance marking + email reports
│       └── utils/
│           └── sendEmail.js          # Nodemailer email utility
│
└── frontend/                         # React + TypeScript + Vite SPA
    ├── index.html                    # HTML entry point
    ├── vite.config.ts                # Vite configuration
    ├── tsconfig.json                 # TypeScript root config
    ├── tsconfig.app.json             # App-specific TS config
    ├── tsconfig.node.json            # Node TS config
    ├── eslint.config.js              # ESLint configuration
    ├── package.json                  # Frontend dependencies & scripts
    ├── package-lock.json
    ├── krmu.webp                     # App logo/image asset
    ├── public/                       # Static assets served as-is
    └── src/
        ├── main.tsx                  # React DOM root mount
        ├── App.tsx                   # Root component (providers + routing)
        ├── App.css                   # Global application styles
        ├── index.css                 # Design system / CSS variables
        ├── assets/                   # Static assets bundled by Vite
        ├── context/
        │   └── AuthContext.tsx        # Auth state management (Context API)
        ├── types/
        │   └── index.ts              # TypeScript type definitions
        ├── utils/
        │   └── storage.ts            # Disabled localStorage stubs
        ├── components/
        │   ├── Header/               # Navigation header (role-aware)
        │   ├── Layout/               # Page layout wrapper
        │   └── ProtectedRoute/       # Auth & role guard component
        └── pages/
            ├── Landing/              # Public landing page
            ├── Auth/                 # Login & Register pages
            ├── Student/
            │   ├── Dashboard/        # Student stats & overview
            │   ├── Events/           # Browse events
            │   ├── EventDetails/     # Event info + register/cancel
            │   └── MyRegistrations/  # View registrations & attendance
            └── Faculty/
                ├── Dashboard/        # Faculty stats & overview
                ├── Events/           # Manage own events
                ├── CreateEvent/      # New event form
                └── EventDetails/     # Registrations + mark attendance
```

---

## 13. Conclusion

### 13.1 Architecture Summary

This system follows a **clean 3-tier architecture** with clear separation:

| Layer                  | Technology                  | Responsibility                                  |
|------------------------|-----------------------------|-------------------------------------------------|
| **Presentation Layer** | React + TypeScript + Vite   | UI rendering, routing, state management         |
| **Application Layer**  | Node.js + Express           | Business logic, auth, API, email                |
| **Data Layer**         | MongoDB Atlas + Mongoose    | Persistent storage, schema validation           |

### 13.2 Key Design Decisions

1. **Monorepo structure** — Frontend and backend live side-by-side, simplifying development and version control.
2. **JWT-based stateless auth** — No server-side sessions; tokens carry role information for RBAC.
3. **Inline route logic** — Business logic lives directly in route files (no separate controller layer), keeping the codebase lean for a project of this scope.
4. **Mongoose ODM** — Provides schema enforcement on top of MongoDB's flexible document model.
5. **React Context (not Redux)** — Lightweight global state solution appropriate for auth-only shared state.
6. **TypeScript on frontend** — Compile-time type safety reduces runtime bugs and improves developer experience.
7. **Disabled localStorage module** — Legacy `storage.ts` stubs exist to prevent import crashes but intentionally throw if called, ensuring all data flows through the backend API.

### 13.3 Strengths

✔ Clear separation of concerns across all three tiers  
✔ Role-based access control on both frontend and backend  
✔ Cloud database (MongoDB Atlas) for data persistence and scalability  
✔ Stateless JWT authentication with 1-day token expiry  
✔ Automated email reporting for attendance  
✔ TypeScript type safety across the frontend  
✔ Consistent REST API design with error handling  
✔ Cascading deletes to maintain data integrity  

### 13.4 Future Extensibility

The architecture supports easy extension for features such as:
- QR-code based attendance scanning
- Certificate generation for event participants
- Admin dashboard with analytics
- Push notifications and real-time updates (WebSocket)
- Multi-campus / multi-college deployment
