# 🔗 Bitly URL Shortener

A modern URL shortening service with analytics, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

## 🚀 Live Demo

- **Frontend** (Vercel): [https://bitly-url-chi.vercel.app/](https://bitly-url-chi.vercel.app/)
- **Backend** (Render): [https://bitly-k3vg.onrender.com/](https://bitly-k3vg.onrender.com/all)

> ⚠️ Note: Backend is hosted on Render’s free tier, so the server may take a few seconds to wake up after periods of inactivity.

---

## 🧪 Test Credentials

To explore the app quickly without registering:

- **Email:** `intern@dacoid.com`  
- **Password:** `Test123`

> These credentials are hardcoded in the database for demo purposes.(If you just want to test go to login page via register page and use these credentials there)


## ✨ Features

- 🔗 **URL Shortening**
  - Custom aliases
  - Expiry date support
  - QR code generation
- 📊 **Analytics Dashboard**
  - Total click tracking
  - Clicks over time
  - Device and browser breakdown
- 🔐 **User Management**
  - Register/Login securely (JWT)
  - Personalized dashboard with URL history
  - Search and filter links

---

## 📈 Analytics Visualization

### Clicks Over Time
- **X-axis**: Dates (e.g., 2025-04-08)
- **Y-axis**: Number of clicks  
  _(Auto-scaled, e.g., 0.94 to 1.06 for 1 click)_

### Device Distribution
- **X-axis**: Device types (`desktop`, `mobile`, `tablet`)
- **Y-axis**: Visit counts or %  
  _(Currently shows `desktop`)_

### Browser Distribution
- **X-axis**: Browser types (`chrome`, `firefox`, etc.)
- **Y-axis**: Visit counts or %  
  _(Currently shows `chrome`)_

---

## 📁 Key Directories and Files Explained

### Frontend (`/client`)

- `/components`
  - `/auth`: Login/Register components
  - `/dashboard`: Analytics and URL list
  - `/ui`: Reusable UI elements (shadcn)
- `/store`
  - `/actions`: Async API calls
  - `/slices`: Redux slices for state
- `config.js`: API URL and other app settings
- `.env.production`: Production API config
- `vite.config.js`: Vite dev server setup
- `src/App.jsx`: Main React app entry

### Backend (`/server`)

- `/controllers`
  - `authController.js`: Auth logic
  - `linkController.js`: Shortening & analytics
- `/middleware`
  - `auth.js`: JWT verification middleware
- `/models`
  - `Link.js`, `User.js`: Mongoose schemas
- `/routes`: API routes (auth, links)
- `/utils`: Helper functions
- `server.js`: Entry point
- `config.js`: Server configuration
- `db/connection.js`: MongoDB setup

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Vite**
- **Redux Toolkit** for state
- **Tailwind CSS** + **shadcn/ui**
- **Chart.js** for graphs
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js**, **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **shortid** for link generation
- **CORS**, **dotenv**

---

## 🔗 GitHub Repo

[GitHub - anirudhVASUDEV23/bitly](https://github.com/anirudhVASUDEV23/bitly)

---

## 📌 Notes

- Backend may delay response for first-time use due to free-tier Render hosting.

