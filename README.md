# Subscription Management Dashboard (SaaSBase)

A premium, enterprise-grade SaaS subscription management dashboard designed with modern UI/UX principles (glassmorphism, smooth animations, dark/light themes). 

## 🛠 Tech Stack Used
### Frontend (Client)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Redux Toolkit (with `redux-persist`)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with secure HTTP-only cookies
- **Payment Simulation**: Razorpay Gateway (Test Mode)

## 🚀 Features
- **Authentication**: JWT-based secure authentication with refresh token rotation.
- **Role-based Access**: Separate dashboards and controls for `admin` and standard `user` accounts.
- **Premium Design**: Beautiful, responsive, and animated UI.
- **Theme Toggle**: Out-of-the-box Dark/Light mode support.
- **Payment Integration**: Razorpay test-mode integration for simulating live payments, upgrades, and downgrades.
- **Interactive Dashboards**: Animated Recharts graphs for usage analytics, real-time loading skeletons, and interactive statistics cards.

---

## 📂 Folder Structure

```
subscription-dashboard-task/
├── client/                     # Frontend Application (Vite + React)
│   ├── public/                 # Static Assets
│   ├── src/                    # Source Code
│   │   ├── api/                # Axios instance and interceptors
│   │   ├── components/         # Reusable UI & Layouts
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   ├── pages/              # Main routes (Dashboard, Plans, Profile, etc.)
│   │   └── store/              # Redux slices (Auth, Theme, Subscription)
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind v4 configuration
│   └── vite.config.js          # Vite build config
│
├── server/                     # Backend API (Node.js + Express)
│   ├── config/                 # DB configuration
│   ├── controllers/            # Route logic
│   ├── middleware/             # Auth, Validation, Error Handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express API routes
│   ├── scripts/                # Database seeders
│   ├── utils/                  # JWT and Razorpay utilities
│   └── server.js               # Entry point
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/subscription-dashboard
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
RAZORPAY_KEY_ID=rzp_test_mock
RAZORPAY_KEY_SECRET=yourrazorpaysecret
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_mock
```

---

## 💻 Setup & Run Instructions

1. **Clone the repository** and install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Seed the database** with initial plans and the default admin user (`admin@example.com` / `admin123`):
   ```bash
   cd server
   npm run seed
   ```

3. **Run the development servers**:
   * Open one terminal for the backend:
     ```bash
     cd server
     npm run dev
     ```
   * Open another terminal for the frontend:
     ```bash
     cd client
     npm run dev
     ```

4. **Access the application**: Navigate to `http://localhost:5173` in your browser.

---

## 🚀 Deployment Guide

### Deploying the Backend on Render
1. Push your code to a GitHub repository.
2. Log in to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository and select the `server` root directory.
4. Set the Build Command to `npm install` and the Start Command to `npm start`.
5. Add all the Environment Variables listed in the Backend `.env` configuration. Ensure `NODE_ENV` is set to `production`.
6. Click **Deploy**.

### Deploying the Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Allow network access from `0.0.0.0/0` (or specifically Render's IPs).
3. Create a database user and password.
4. Copy the connection string and replace `MONGO_URI` in Render's environment variables.

### Deploying the Frontend on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository and configure the Root Directory as `client`.
3. Vercel will automatically detect **Vite**.
4. In the Environment Variables section, add `VITE_API_URL` pointing to your new live Render backend URL (e.g., `https://your-backend.onrender.com/api`).
5. Click **Deploy**.

---

## 📞 Author & Contact

**[Vetri selvan]**
- **Email:** [kabilvetri404@gmail.com]
- **LinkedIn:** [linkedin.com/in/vetriselvan-e-06114622a]
- **GitHub:** [Your GitHub URL]
