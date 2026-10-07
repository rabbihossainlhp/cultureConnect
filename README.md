#  CultureConnect

A full-stack platform that connects people across cultures, enabling them to share experiences, learn languages, participate in live discussions, and build meaningful relationships.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [WebSocket Events](#-websocket-events)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🎯 Overview

CultureConnect is a platform designed to foster cross-cultural connections and understanding. Users can share cultural posts, participate in live rooms, learn languages, exchange direct messages, and build a global community. The platform features real-time communication through WebSockets, secure authentication, and a responsive modern user interface.

**Key Goals:**
- Bridge cultural gaps through meaningful interactions
- Enable language learning through community engagement
- Facilitate real-time discussions and networking
- Provide a safe and inclusive space for cultural exchange

---

## ✨ Features

### 👤 Authentication & User Management
- ✅ Email/password signup with OTP verification
- ✅ Email-based login
- ✅ Firebase/Google authentication
- ✅ JWT-based session management
- ✅ Secure password hashing with bcrypt
- ✅ User profile management (bio, country, language, profile picture)

### 📝 Content Creation & Sharing
- ✅ Create and publish cultural posts with images
- ✅ Add comments to posts
- ✅ Like/unlike posts
- ✅ Comment management (add, delete)
- ✅ Rich media support via Cloudinary

### 🎤 Live Rooms & Communication
- ✅ Create live discussion rooms
- ✅ Real-time messaging in rooms (WebSocket)
- ✅ Participant management (join/leave)
- ✅ Auto-rejoin functionality for users
- ✅ Direct messaging between users (WebSocket-based)

### 🌐 Additional Features
- ✅ Explore posts and communities
- ✅ User profiles with public bio
- ✅ Media upload and storage
- ✅ Real-time notifications via Socket.io

### 🎨 User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Tailwind CSS & DaisyUI
- ✅ Smooth animations with Framer Motion
- ✅ Icon library (Lucide React)
- ✅ Analytics integration (Vercel Analytics)

### 📊 Performance & Scalability
- ✅ Redis caching for improved performance
- ✅ CDN integration via Cloudinary for media
- ✅ Socket.io for efficient real-time communication
- ✅ PostgreSQL for reliable data storage
- ✅ JWT-based stateless authentication

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| DaisyUI | UI component library |
| React Router | Navigation |
| Socket.io Client | Real-time communication |
| Firebase | Authentication & services |
| Framer Motion | Animations |
| Lucide React | Icons |
| Vercel Analytics | Analytics tracking |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express 5 | Web framework |
| PostgreSQL | Primary database |
| Redis | Caching & session management |
| Socket.io | Real-time communication (rooms, DMs) |
| JWT | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Image/video storage & CDN |
| Multer | File upload handling |
| Email Services | Email delivery (Nodemailer, Brevo, Mailtrap) |

---

## 📁 Project Structure

```
cultureConnect/
├── Client/                          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── auth/                # Login & Signup
│   │   │   ├── common/              # Common components (Hero, Cards, etc.)
│   │   │   ├── navbar/              # Navigation
│   │   │   └── Footer/              # Footer
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── SinglePost.tsx
│   │   │   ├── Deshboard/           # User dashboard
│   │   │   ├── Learn/               # Language learning
│   │   │   └── LiveRooms/           # Live discussion rooms
│   │   ├── Layout/                  # Layout components
│   │   │   ├── RootLayOut.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── router/                  # Route guards & configuration
│   │   ├── contexts/                # React Context (Auth, etc.)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API & Firebase services
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── config/                  # Configuration files
│   │   ├── assets/                  # Static images & media
│   │   ├── App.tsx                  # Main App component
│   │   └── main.tsx                 # Entry point
│   ├── public/                      # Public static files
│   ├── package.json                 # Dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── vercel.json                  # Vercel deployment config
│
├── Server/                          # Backend (Node.js + Express)
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── socket.js                    # Socket.io setup
│   ├── dbIniti.js                   # Database initialization
│   ├── config/
│   │   ├── db.js                    # Database configuration
│   │   ├── email.js                 # Email service config
│   │   └── redis.js                 # Redis configuration
│   ├── models/                      # Database models
│   │   ├── user.model.js
│   │   ├── cultural-post.model.js
│   │   ├── post-comment.model.js
│   │   ├── room.model.js
│   │   ├── direct-message.model.js
│   │   └── ... (other models)
│   ├── controllers/                 # Business logic
│   │   ├── auth/                    # Authentication
│   │   ├── post/                    # Posts, comments, likes
│   │   ├── profile/                 # User profile
│   │   ├── room/                    # Live rooms
│   │   └── media/                   # Media handling
│   ├── routes/                      # API endpoints
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── profile.routes.js
│   │   ├── room.routes.js
│   │   └── routes.js
│   ├── middleware/                  # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── imageUpload.middleware.js
│   │   └── socketAuth.middleware.js
│   ├── socket/                      # WebSocket handlers
│   │   ├── socketHandler.js
│   │   ├── dmSocketHandler.js
│   │   └── socket.helper.js
│   ├── redis/                       # Redis helpers
│   ├── tests/                       # Test files
│   ├── package.json                 # Dependencies
│   └── constants/                   # Constants
│
└── README.md                        # This file
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** (package manager)
- **PostgreSQL** (v12 or higher)
- **Redis** (for caching)
- **Git** (version control)

### Optional but Recommended:
- **Postman** or **Thunder Client** (API testing)
- **VSCode** (code editor)
- **Docker** (for containerized setup)

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rabbihossainlhp/cultureConnect.git
cd cultureConnect
```

### 2. Setup Backend (Server)

```bash
cd Server

# Install dependencies
npm install

# Create .env file and configure it
# Add your database, Redis, Firebase, Cloudinary, and email service credentials
nano .env

# Start the development server
npm run dev
```

### 3. Setup Frontend (Client)

```bash
cd ../Client

# Install dependencies
npm install

# Create .env file and configure it
# Add Firebase and API endpoint configuration
nano .env

# Start development server
npm run dev
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Server
npm run dev
```
Server runs on: `http://localhost:5000` (or your configured PORT in .env)

**Terminal 2 - Frontend:**
```bash
cd Client
npm run dev
```
Frontend runs on: `http://localhost:5173` (default Vite port)

> **Note:** Make sure PostgreSQL, Redis are running and environment variables are configured before starting the server.

### Production Build

**Frontend:**
```bash
cd Client
npm run build      # Build the project
npm run preview    # Preview production build
```

**Backend:**
```bash
cd Server
npm start          # Start server in production mode
```

---

## 📜 Available Scripts

### Frontend Scripts

```bash
npm run dev        # Start development server with Vite
npm run build      # Build TypeScript and bundle for production
npm run lint       # Run ESLint to check code quality
npm run preview    # Preview the production build locally
```

### Backend Scripts

```bash
npm run dev        # Start server with Nodemon (auto-reload on changes)
npm start          # Start server in production mode
npm test           # Run tests with Jest
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cultureConnect
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Firebase (for social authentication)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_APP_ID=your_firebase_app_id

# Cloudinary (Media upload & storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (configure one of these)
# Option 1: Nodemailer with SMTP
MAIL_HOST=smtp.your-email-provider.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# Option 2: Brevo
BREVO_API_KEY=your_brevo_api_key

# Email Configuration
EMAIL_FROM=noreply@cultureconnect.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Analytics (Optional)
VITE_VERCEL_ANALYTICS_ID=your_analytics_id
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user with email & password |
| POST | `/api/auth/otp-verify` | Verify OTP during registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout (requires authentication) |
| POST | `/api/auth/continue-with-google` | Firebase/Google authentication |

### Post Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/post/list` | Get all posts |
| POST | `/api/post/create` | Create new post (requires authentication) |
| POST | `/api/post/like-unlike` | Toggle like on a post (requires authentication) |
| POST | `/api/post/:postId/comment` | Add comment to post (requires authentication) |
| GET | `/api/post/:postId/comments` | Get all comments for a post |
| DELETE | `/api/post/comment/:commentId` | Delete comment (requires authentication) |

### Room Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/room/room-list` | Get all rooms (requires authentication) |
| POST | `/api/room/create-room` | Create new room (requires authentication) |
| - | WebSocket | Join/Leave rooms via Socket.io |

### Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile (requires authentication) |
| PUT | `/api/profile` | Update profile & avatar (requires authentication) |

### Media Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media` | Upload media (images/videos) |

---

## 🔌 WebSocket Events

### Authentication
Socket connections require authentication middleware. The user data is attached to `socket.data.user`.

### Room Events

```javascript
// Client to Server
socket.emit('join-room', { roomId, userId })
socket.emit('leave-room', { roomId, userId })
socket.emit('send-room-message', { roomId, message, userId })

// Server to Client
socket.on('room-message', (data))
socket.on('user-joined-room', (data))
socket.on('user-left-room', (data))
socket.on('room-updated', (data))
```

### Direct Message (DM) Events

```javascript
// Client to Server
socket.emit('send-dm', { recipientId, message })
socket.emit('dm-typing', { recipientId })

// Server to Client
socket.on('receive-dm', (data))
socket.on('dm-user-typing', (data))
```

> **Note:** Direct messages are handled entirely through WebSocket (Socket.io). There are no REST API endpoints for DMs.

---

## 🗄 Database Schema

### Key Tables

**Users**
- id, email, password, username, country, native_language, profile_picture, bio, is_verified, joined_rooms, created_at

**Cultural Posts**
- id, author_id, title, description, tags, slug, post_image, status, readtime, likes (array), likes_count, comments_count, created_at, updated_at, deleted_at

**Post Comments**
- id, post_id, user_id, content, created_at

**Rooms**
- id, name, description, created_by, max_participants, is_active, created_at

**Room Messages**
- id, room_id, user_id, message, created_at

**Room Participants**
- id, room_id, user_id, joined_at

**Direct Messages**
- id, sender_id, recipient_id, message, is_read, created_at

**Email Verification Codes**
- id, email, otp, attempts, expires_at, created_at

---

## 🌐 Deployment

### Deploy Frontend on Vercel

```bash
cd Client
npm run build
vercel --prod
```

### Deploy Backend on Heroku/Railway/Render

1. Ensure all environment variables are set
2. Ensure PostgreSQL and Redis are available
3. Push to repository and connect to deployment platform
4. Set environment variables in platform dashboard
5. Deploy

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Standards

- Follow ESLint rules (run `npm run lint`)
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📧 Contact & Support

- **Project Owner**: Rabbi Hossain
- **Email**: contact@cultureconnect.com
- **GitHub**: [@rabbihossainlhp](https://github.com/rabbihossainlhp)
- **Issues**: [Report bugs](https://github.com/rabbihossainlhp/cultureConnect/issues)
- **Discussions**: [Start a discussion](https://github.com/rabbihossainlhp/cultureConnect/discussions)

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with ❤️ for cultural connection
- Inspired by the need for global understanding

---

**Happy Coding! 🚀**

---

*Last Updated: 2026-06-21*
