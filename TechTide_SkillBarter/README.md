# TechTide SkillBarter India

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue.svg" alt="React Version" />
  <img src="https://img.shields.io/badge/Node.js-Express-green.svg" alt="Backend" />
  <img src="https://img.shields.io/badge/MongoDB-7.5.0-green.svg" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.7.2-orange.svg" alt="Socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Schema](#database-schema)
- [Matching Algorithm](#matching-algorithm)
- [Real-time Features](#real-time-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

*TechTide SkillBarter India* is a comprehensive skill exchange platform that enables users to trade skills without monetary transactions. Built specifically for the Indian market, it supports multiple regional languages and provides a safe, verified environment for skill sharing and learning.

### Core Concept
- *Skill Exchange*: Users can offer skills they know and request skills they want to learn
- *No Money Involved*: Pure skill-for-skill bartering system
- *AI-Powered Matching*: Smart algorithm connects compatible users
- *Multi-Language Support*: Available in Hindi, Tamil, Telugu, Bengali, and more
- *Community-Driven*: Build learning communities around shared interests

## ✨ Features

### 🔐 Authentication & User Management
- *Secure Registration/Login* with JWT tokens
- *Profile Management* with avatar upload via Cloudinary
- *User Verification* system for enhanced security
- *Multi-language Support* (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati)
- *Location-based Services* with state/city/pincode support

### 🎯 Skill Management
- *Comprehensive Skill Categories*:
  - Technology (Web Dev, Mobile Dev, Data Science, ML, DevOps, etc.)
  - Languages (English, Hindi, Spanish, French, etc.)
  - Creative Arts (Photography, Music, Design, etc.)
  - Business & Finance (Marketing, Sales, Accounting, etc.)
  - Lifestyle & Wellness (Fitness, Yoga, Cooking, etc.)
  - Academic Subjects (Math, Physics, Chemistry, etc.)
  - Trades & Crafts (Plumbing, Electrical, Carpentry, etc.)

- *Skill Proficiency Levels*: Beginner, Intermediate, Advanced, Expert
- *Priority System* for wanted skills (Low, Medium, High)
- *Skill Points & Badges* gamification system

### 🤝 Smart Matching System
- *AI-Powered Algorithm* with weighted scoring:
  - Skill Match (40%): Mutual skill compatibility
  - Location Proximity (20%): Geographic compatibility
  - Proficiency Level (20%): Teaching/learning level match
  - User Rating (10%): Community reputation
  - Availability (10%): Active user status

- *Match Status Tracking*: Pending, Accepted, Rejected, Completed, Cancelled
- *Session Management*: Schedule, track, and rate learning sessions

### 💬 Real-time Communication
- *Socket.io Integration* for instant messaging
- *Chat Rooms* for skill exchange discussions
- *Typing Indicators* and message status
- *File Sharing* capabilities
- *Video Call Integration* for remote learning

### 🏘️ Community Features
- *Community Creation* and management
- *Skill-based Groups* for focused learning
- *Community Chat* for group discussions
- *Member Management* with moderation tools

### 📊 Progress Tracking
- *Dashboard Analytics* with comprehensive statistics
- *Skill Point System* for gamification
- *Badge Collection* for achievements
- *Session History* and progress tracking
- *Rating & Review System*

## 🛠 Tech Stack

### Frontend
- *React 18.2.0* - Modern UI framework
- *React Router DOM 6.15.0* - Client-side routing
- *Axios 1.5.0* - HTTP client for API calls
- *Socket.io Client 4.7.2* - Real-time communication
- *React Hook Form 7.45.4* - Form management
- *React Hot Toast 2.4.1* - Notification system
- *Lucide React 0.288.0* - Icon library
- *Tailwind CSS 3.3.3* - Utility-first CSS framework

### Backend
- *Node.js* - Runtime environment
- *Express.js 4.18.2* - Web framework
- *MongoDB 7.5.0* - NoSQL database
- *Mongoose 7.5.0* - MongoDB object modeling
- *Socket.io 4.7.2* - Real-time bidirectional communication
- *JWT (jsonwebtoken 9.0.2)* - Authentication tokens
- *Bcryptjs 2.4.3* - Password hashing
- *Cloudinary 1.40.0* - Image upload and management
- *Nodemailer 6.9.4* - Email services
- *Express Validator 7.0.1* - Input validation

### Development Tools
- *Nodemon 3.0.1* - Development server
- *Jest 29.6.2* - Testing framework
- *PostCSS 8.4.29* - CSS processing
- *Autoprefixer 10.4.15* - CSS vendor prefixing

## 📁 Project Structure


TechTide_SkillBarter/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── app.js            # Main application entry point
│   │   ├── config/           # Configuration files
│   │   │   ├── cloudinary.js # Cloudinary setup
│   │   │   └── database.js   # MongoDB connection
│   │   ├── controllers/      # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── communityController.js
│   │   │   ├── matchController.js
│   │   │   ├── skillController.js
│   │   │   └── userController.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js       # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Chat.js
│   │   │   ├── Community.js
│   │   │   ├── Match.js
│   │   │   ├── Skill.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── chats.js
│   │   │   ├── communities.js
│   │   │   ├── matches.js
│   │   │   ├── skills.js
│   │   │   └── users.js
│   │   └── utils/           # Utility functions
│   │       ├── database.js
│   │       ├── helpers.js
│   │       ├── matchingAlgorithm.js
│   │       └── notifications.js
│   ├── package.json
│   └── package-lock.json
├── frontend/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── common/      # Common UI components
│   │   │   ├── community/   # Community components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── matching/    # Matching components
│   │   ├── context/         # React Context providers
│   │   │   ├── AppContext.js
│   │   │   ├── AuthContext.js
│   │   │   └── ChatContext.js
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useChat.js
│   │   │   └── useSkills.js
│   │   ├── pages/           # Page components
│   │   │   ├── Chat.js
│   │   │   ├── Community.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Home.js
│   │   │   ├── Matches.js
│   │   │   ├── Profile.js
│   │   │   └── Skills.js
│   │   ├── services/        # API service functions
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   ├── communities.js
│   │   │   ├── matches.js
│   │   │   ├── skills.js
│   │   │   ├── socket.js
│   │   │   └── users.js
│   │   ├── styles/          # CSS styles
│   │   │   ├── components.css
│   │   │   ├── globals.css
│   │   │   └── responsive.css
│   │   ├── utils/           # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   ├── App.js           # Main App component
│   │   └── index.js         # React entry point
│   ├── build/               # Production build
│   ├── package.json
│   └── package-lock.json
└── README.md


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. *Navigate to backend directory*
   bash
   cd backend
   

2. *Install dependencies*
   bash
   npm install
   

3. *Environment Configuration*
   Create a .env file in the backend directory:
   env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillbarter
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   

4. *Start MongoDB*
   bash
   mongod
   

5. *Run the backend server*
   bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   

### Frontend Setup

1. *Navigate to frontend directory*
   bash
   cd frontend
   

2. *Install dependencies*
   bash
   npm install
   

3. *Environment Configuration*
   Create a .env file in the frontend directory:
   env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   

4. *Start the development server*
   bash
   npm start
   

The application will be available at http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}


#### POST /api/auth/login
Login user
json
{
  "email": "john@example.com",
  "password": "password123"
}


#### GET /api/auth/me
Get current user profile (requires authentication)

### User Management Endpoints

#### GET /api/users/search
Search users with filters

Query Parameters:
- q: search query
- location: city/state filter
- skills: comma-separated skills
- page: page number
- limit: results per page


#### GET /api/users/:id
Get user by ID

#### PUT /api/users/skills
Update user skills
json
{
  "skillsOffered": [
    {
      "skill": "JavaScript",
      "proficiency": "Advanced",
      "description": "5+ years experience"
    }
  ],
  "skillsWanted": [
    {
      "skill": "Python",
      "priority": "High"
    }
  ]
}


### Skills Endpoints

#### GET /api/skills
Get all skills with optional filtering

Query Parameters:
- category: filter by category
- search: search term
- page: page number
- limit: results per page


#### GET /api/skills/categories
Get all skill categories

#### POST /api/skills
Create new skill (admin only)
json
{
  "name": "React.js",
  "category": "Technology",
  "description": "Frontend JavaScript library"
}


### Matching Endpoints

#### GET /api/matches/potential
Get potential matches for current user

Query Parameters:
- limit: number of matches to return
- minScore: minimum match score


#### POST /api/matches
Create a new match
json
{
  "targetUserId": "user_id",
  "user1Skill": "JavaScript",
  "user2Skill": "Python"
}


#### PUT /api/matches/:id/accept
Accept a match

#### PUT /api/matches/:id/reject
Reject a match

#### GET /api/matches
Get user's matches

Query Parameters:
- status: filter by status (pending, accepted, completed)
- page: page number
- limit: results per page


### Chat Endpoints

#### GET /api/chats
Get user's chat conversations

#### GET /api/chats/match/:matchId
Get or create chat for a match

#### POST /api/chats/messages
Send a message
json
{
  "chatId": "chat_id",
  "content": "Hello!",
  "messageType": "text"
}


#### PUT /api/chats/mark-read
Mark messages as read

### Community Endpoints

#### GET /api/communities
Get all communities

#### POST /api/communities
Create a new community
json
{
  "name": "JavaScript Developers",
  "description": "Community for JS developers",
  "category": "Technology",
  "isPublic": true
}


#### POST /api/communities/:id/join
Join a community

#### DELETE /api/communities/:id/leave
Leave a community

## 🎨 Frontend Components

### Core Components

#### Authentication Components
- *Login.js*: User login form with validation
- *Register.js*: User registration form
- *ForgotPassword.js*: Password reset functionality

#### Dashboard Components
- *UserProfile.js*: User profile display and editing
- *SkillManager.js*: Add/edit/remove skills
- *MatchFinder.js*: Display potential matches
- *ProgressTracker.js*: Track learning progress and achievements

#### Chat Components
- *ChatWindow.js*: Main chat interface
- *Message.js*: Individual message component
- *VideoCall.js*: Video calling functionality

#### Community Components
- *CommunityCard.js*: Community display card
- *CommunityChat.js*: Group chat interface
- *SkillCircle.js*: Visual skill representation

#### Common Components
- *Header.js*: Navigation header
- *Footer.js*: Site footer
- *LoadingSpinner.js*: Loading indicator
- *Modal.js*: Reusable modal component
- *Navbar.js*: Navigation component

### Pages

#### Home Page (Home.js)
- Hero section with platform introduction
- Feature highlights
- Statistics display
- How it works section
- Call-to-action buttons

#### Dashboard (Dashboard.js)
- User statistics and metrics
- Recent activity feed
- Quick match suggestions
- Skill progress overview
- Upcoming sessions

#### Matches (Matches.js)
- Potential matches list
- Match status management
- Session scheduling
- Rating and feedback system

#### Profile (Profile.js)
- User profile editing
- Skill management
- Achievement display
- Settings configuration

#### Skills (Skills.js)
- Browse skill categories
- Search and filter skills
- Add skills to profile
- Skill recommendations

#### Community (Community.js)
- Community discovery
- Join/leave communities
- Community discussions
- Member management

#### Chat (Chat.js)
- Real-time messaging
- File sharing
- Video calling
- Message history

## 🗄 Database Schema

### User Model
javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  phone: String (validated 10-digit),
  location: {
    state: String,
    city: String,
    pincode: String
  },
  avatar: {
    public_id: String,
    url: String
  },
  bio: String (max 500 chars),
  skillsOffered: [{
    skill: String (required),
    proficiency: String (enum: Beginner, Intermediate, Advanced, Expert),
    description: String
  }],
  skillsWanted: [{
    skill: String (required),
    priority: String (enum: Low, Medium, High)
  }],
  skillPoints: Number (default: 0),
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date
  }],
  rating: {
    average: Number (0-5),
    count: Number
  },
  language: String (enum: en, hi, ta, te, bn, mr, gu),
  isVerified: Boolean (default: false),
  lastActive: Date (default: now),
  timestamps: true
}


### Skill Model
javascript
{
  name: String (required, unique, max 50 chars),
  category: String (required, enum: Technology, Languages, Arts & Crafts, etc.),
  description: String (max 200 chars),
  icon: String,
  popularity: Number (default: 0),
  isActive: Boolean (default: true),
  timestamps: true
}


### Match Model
javascript
{
  user1: ObjectId (ref: User, required),
  user2: ObjectId (ref: User, required),
  skillExchange: {
    user1Skill: {
      skill: String,
      proficiency: String
    },
    user2Skill: {
      skill: String,
      proficiency: String
    }
  },
  matchScore: Number (0-100, required),
  status: String (enum: pending, accepted, rejected, completed, cancelled),
  initiatedBy: ObjectId (ref: User, required),
  sessions: [{
    date: Date,
    duration: Number (minutes),
    topic: String,
    notes: String,
    user1Rating: Number (1-5),
    user2Rating: Number (1-5)
  }],
  totalSessions: Number (default: 0),
  completedAt: Date,
  timestamps: true
}


### Chat Model
javascript
{
  participants: [ObjectId (ref: User)],
  matchId: ObjectId (ref: Match),
  messages: [{
    sender: ObjectId (ref: User),
    content: String,
    messageType: String (enum: text, image, file, system),
    timestamp: Date,
    isRead: Boolean
  }],
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: ObjectId (ref: User)
  },
  timestamps: true
}


### Community Model
javascript
{
  name: String (required, max 50 chars),
  description: String (max 500 chars),
  category: String (required),
  creator: ObjectId (ref: User, required),
  members: [ObjectId (ref: User)],
  moderators: [ObjectId (ref: User)],
  isPublic: Boolean (default: true),
  rules: [String],
  skillTags: [String],
  memberCount: Number (default: 0),
  timestamps: true
}


## 🧠 Matching Algorithm

The platform uses a sophisticated matching algorithm that considers multiple factors to find the best skill exchange partners:

### Scoring Weights
- *Skill Match (40%)*: Mutual skill compatibility
- *Location Proximity (20%)*: Geographic compatibility  
- *Proficiency Level (20%)*: Teaching/learning level match
- *User Rating (10%)*: Community reputation
- *Availability (10%)*: Active user status

### Algorithm Steps

1. *Skill Matching*: Identifies users whose offered skills match your wanted skills and vice versa
2. *Location Scoring*: Prioritizes users in the same city (1.0), state (0.7), or country (0.3)
3. *Proficiency Compatibility*: Ensures teaching/learning levels are compatible
4. *Rating Assessment*: Considers user reputation and feedback
5. *Availability Check*: Factors in user activity and responsiveness

### Match Score Calculation
javascript
score = (skillMatch * 0.4) + (location * 0.2) + (proficiency * 0.2) + (rating * 0.1) + (availability * 0.1)


### Best Exchange Detection
The algorithm identifies the most valuable skill exchanges by:
- Matching offered skills with wanted skills
- Prioritizing high-priority wanted skills
- Considering proficiency levels
- Returning top 2 exchanges per match

## 🔄 Real-time Features

### Socket.io Integration
The platform uses Socket.io for real-time communication:

#### Connection Events
- join-user: User joins their personal room
- join-chat: User joins a specific chat room
- disconnect: Handle user disconnection

#### Chat Events
- send-message: Send message to chat room
- receive-message: Receive message from other users
- typing-start: User starts typing
- typing-stop: User stops typing
- user-typing: Show typing indicator
- user-stop-typing: Hide typing indicator

#### Implementation
javascript
// Backend Socket.io setup
io.on('connection', (socket) => {
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('send-message', (data) => {
    socket.to(`chat-${data.chatId}`).emit('receive-message', data);
  });
});

// Frontend Socket.io client
const socket = io(process.env.REACT_APP_SOCKET_URL);
socket.emit('join-user', userId);
socket.on('receive-message', handleMessage);


## 🚀 Deployment

### Backend Deployment (Heroku)

1. *Create Heroku app*
   bash
   heroku create skillbarter-backend
   

2. *Set environment variables*
   bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   

3. *Deploy*
   bash
   git push heroku main
   

### Frontend Deployment (Netlify)

1. *Build the project*
   bash
   cd frontend
   npm run build
   

2. *Deploy to Netlify*
   - Connect GitHub repository
   - Set build command: npm run build
   - Set publish directory: build
   - Add environment variables:
     
     REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
     REACT_APP_SOCKET_URL=https://your-backend-url.herokuapp.com
     

### Database Setup (MongoDB Atlas)

1. *Create MongoDB Atlas cluster*
2. *Configure network access*
3. *Create database user*
4. *Get connection string*
5. *Update backend environment variables*

### Environment Variables Summary

#### Backend (.env)
env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbarter
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-url.netlify.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password


#### Frontend (.env)
env
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.herokuapp.com


## 🤝 Contributing

We welcome contributions to TechTide SkillBarter! Here's how you can help:

### Development Setup
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Areas for Contribution
- *Frontend*: UI/UX improvements, new components, responsive design
- *Backend*: API enhancements, performance optimization, new features
- *Algorithm*: Matching algorithm improvements, new scoring factors
- *Documentation*: API docs, user guides, developer documentation
- *Testing*: Unit tests, integration tests, end-to-end tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@skillbarter.in or join our community discussions.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database solution
- Socket.io team for real-time communication
- All contributors and users who help improve the platform

---

<div align="center">
  <p>Made with ❤️ by the TechTide SkillBarter Team</p>
  <p>© 2024 TechTide SkillBarter India. All rights reserved.</p>
</div>
