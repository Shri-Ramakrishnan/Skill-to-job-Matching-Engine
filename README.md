# Skill-to-Job Matching Engine (MERN)

A demo-ready MERN application that matches student skills to jobs using a weighted rule-based scoring engine.

## Overview

The project includes:
- Role-based authentication (Student, Recruiter, Admin)
- Student skill management and job matching with skill gap analysis
- Recruiter job management (create, update, delete, list)
- Admin analytics dashboard

## Architecture

```text
+-------------------+          HTTP/JSON           +-----------------------------+
| React Frontend    |  <------------------------>  | Node.js + Express Backend   |
| - Auth Context    |                              | - JWT + RBAC Middleware     |
| - Role Dashboards |                              | - Joi Validation            |
| - Axios API Layer |                              | - Controllers + Services    |
+-------------------+                              +--------------+--------------+
                                                                  |
                                                                  | Mongoose
                                                                  v
                                                      +--------------------------+
                                                      | MongoDB                  |
                                                      | - users                  |
                                                      | - jobs                   |
                                                      +--------------------------+
```

## Matching Algorithm

For each job:

```text
matchScore = (sum of matched skill weights / total job skill weights) * 100
```

Where:
- Matched skill weight: weight of a required job skill that exists in student skills
- Total job skill weight: sum of all required skill weights in that job
- Missing skills: required skills absent from student profile

Implemented in `backend/src/services/matchingService.js`.

## Folder Structure

```text
Skill-to-Job/
|- backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- services/
|  |  |- validators/
|  |  |- seeds/
|  |  `- server.js
|  `- package.json
`- frontend/
   |- src/
   |  |- api/
   |  |- components/
   |  |- context/
   |  |- hooks/
   |  |- pages/
   |  |- styles/
   |  `- utils/
   `- package.json
```

## API List

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Student
- `PUT /api/students/skills`
- `GET /api/students/matches?threshold=0&location=&role=&requiredSkill=`

### Recruiter
- `GET /api/recruiters/jobs`
- `POST /api/recruiters/jobs`
- `PUT /api/recruiters/jobs/:jobId`
- `DELETE /api/recruiters/jobs/:jobId`

### Admin
- `GET /api/admin/stats`

## Local Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set `backend/.env` values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=1d
```

Run backend:

```bash
npm run dev
```

### 2) Seed Demo Data

```bash
cd backend
npm run seed
```

This resets `users` and `jobs` collections and inserts demo data.

### 3) Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Set `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Demo Credentials

- Admin
  - Email: `admin@skilltojob.com`
  - Password: `Admin@123`
- Recruiter 1
  - Email: `recruiter1@skilltojob.com`
  - Password: `Recruiter@123`
- Recruiter 2
  - Email: `recruiter2@skilltojob.com`
  - Password: `Recruiter@123`
- Student
  - Email: `student@skilltojob.com`
  - Password: `Student@123`

## Demo Flow (Interview/Viva)

1. Login as Student, update skills, run matching, explain score and missing-skill tags.
2. Login as Recruiter, create/edit/delete jobs and show they affect student matches.
3. Login as Admin, open stats and explain role distribution and top skills.

## Hardening Notes

- Axios automatically attaches `Authorization: Bearer <token>`.
- Global 401/403 handling clears auth and redirects user to login.
- Controlled forms and consistent error extraction improve UI stability.
- Token-expiry based auto logout is implemented in Auth Context.
