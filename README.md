# Job Portal Application

A full-stack Job Portal web application that connects job seekers with employers. This platform allows users to browse, apply for, and manage job applications, while enabling employers to post jobs, track applicants, and manage hiring workflows.

---

## 🔗 Live Demo  
https://jobscope.vercel.app/

---

## 🚀 Features

### 🔹 General
- Browse all job listings with filters and search functionality
- Secure login and registration with JWT-based authentication
- Role-based access for job seekers and employers

### 🔹 Employer Dashboard
- Post, edit, and delete job listings
- View dashboard stats: total jobs, applicants, hires, and pending reviews
- Track applicants with status updates: pending, reviewed, accepted, or rejected
- Visual analytics for job and applicant tracking

### 🔹 Job Seeker Dashboard
- View jobs applied to and their current status
- Apply to jobs through a structured form
- View detailed job descriptions and company info
- Application tracking via personal dashboard

### 🔹 Additional UI Sections
- Featured Jobs
- Jobs in Numbers (Stats)
- Success Stories

---

## 🛠 Tech Stack

### Frontend:
- React (Vite + TypeScript)
- Tailwind CSS
- Zustand (state management)

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication

---

## 🔐 Authentication

- JWT tokens are used for secure login sessions.
- Separate roles: `employer` and `job seeker`
- Route-level protection implemented on both frontend and backend

---
