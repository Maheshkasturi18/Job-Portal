# 💼 Job Portal 

This is a full-featured Job Portal web application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It supports **user authentication**, **role-based access control**, **job listings**, **applications**, and **analytics dashboards** for both employers and job seekers.

---

## ✨ Features

### 🔐 User Authentication & RBAC

- Secure **JWT-based authentication**
- **Role-based access control** for:
  - **Job Seekers** – apply for jobs, track applications
  - **Employers** – post jobs, manage listings, and view applicants

### 💼 Job Listings

- **Employers** can **create, update, and delete** job posts
- **Job Seekers** can **browse and search** jobs
- Extended job form with fields like location, salary, type, etc.

### 📥 Job Application System

- Job Seekers can **apply to jobs**
- Employers can **view applicants** and update their **application status**:
  - `Pending`, `Reviewed`, `Accepted`, `Rejected`
- Job Seekers can track these updates in their **Dashboard**

### 📊 Dashboards

- **Employer Dashboard**:
  - Manage posted jobs
  - View list of applicants
  - Weekly application **analytics**

- **Job Seeker Dashboard**:
  - View applied jobs
  - Track application status
  - See dynamic **weekly activity chart**

### 🌙 UI Enhancements

- **Dark mode** toggle
- **Logout** and **dynamic navbar** (shows username and role)
- **"Post Job" button hidden for Job Seekers**
- Responsive and user-friendly design

---

## 🚀 How to Use

### 1️⃣ Visit the Website

- Landing page shows **Browse Jobs** and **Post Job** options
- You must **sign up** to apply or post jobs

### 2️⃣ Sign Up & Choose Role

- Create an account by selecting either:
  - **Job Seeker**
  - **Employer**

### 3️⃣ Role-Based Features

#### 👤 Job Seekers

- Browse jobs and apply via the application form
- View **application status** in your dashboard
- View **analytics** of applications over time

#### 🧑‍💼 Employers

- Create job listings
- View & manage job posts (only their own)
- View applicants and change application statuses
- Analytics dashboard to track application trends

> ✅ Employers can **only see and manage their own jobs** and applicants — no cross-access between employers.

---

