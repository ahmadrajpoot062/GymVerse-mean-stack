# 🏋️ GymVerse - Modern Gym Training Platform

**A complete MEAN stack application for gym training and trainer marketplace**

![GymVerse](https://img.shields.io/badge/Stack-MEAN-red?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-17+-red?style=for-the-badge&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-18+-black?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-red?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-black?style=for-the-badge&logo=typescript)

## 🎯 Project Overview

GymVerse is a comprehensive gym training platform that connects fitness enthusiasts with professional trainers. Built with modern MEAN stack architecture, it features a complete trainer marketplace, training programs, exercise plans, and membership management.

### 🌟 Key Features

- **Multi-page Angular Frontend** with standalone routing
- **Trainer Marketplace** with approval system
- **Training Programs** with CRUD operations
- **Exercise & Diet Plans** with difficulty levels
- **User Authentication** with JWT and role-based access
- **Admin Dashboard** for complete platform management
- **Responsive Design** with custom Red-White-Black theme
- **Real-time Notifications** and email integration

## 🏗️ Architecture

```
GymVerse/
├── server/                 # Node.js + Express Backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middlewares
│   ├── config/            # Database & app configuration
│   ├── uploads/           # File uploads storage
│   └── utils/             # Utility functions
├── client/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # Angular services
│   │   │   ├── models/        # TypeScript interfaces
│   │   │   ├── guards/        # Route guards
│   │   │   └── shared/        # Shared utilities
│   │   ├── assets/            # Static assets
│   │   └── styles/            # Global styles
└── colors.js             # Global color theme configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Angular CLI 17+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GymVerse
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In server/ directory
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Run the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   ng serve
   ```

7. **Access the Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

## 🎨 Color Theme System

GymVerse uses a centralized color system defined in `colors.js`:

- **White (40%)**: Primary backgrounds and text
- **Red (40%)**: Brand colors and CTAs
- **Black (20%)**: Accent colors and borders

To change the entire theme, simply modify `colors.js` and all components will update automatically.

## 🔐 User Roles & Permissions

### User Roles
- **Admin**: Full platform management
- **Trainer**: Profile management, video uploads, client interaction
- **User**: Browse programs, contact trainers, manage subscriptions

### Authentication Flow
1. JWT-based authentication
2. Role-based route protection
3. Password encryption with bcrypt
4. Secure API endpoints

## 📱 Pages & Features

### Public Pages
- **Home**: Hero banner, motivational content, CTAs
- **About**: Mission, vision, timeline
- **Programs**: Training program showcase
- **Trainers**: Trainer marketplace and profiles
- **Membership**: Pricing tiers and benefits
- **Exercise Plans**: Built-in workout routines
- **Diet Plans**: Weight loss/gain meal plans
- **Gallery**: Gym photos with lightbox
- **Contact**: Contact form and location

### Protected Pages
- **User Dashboard**: Profile, subscriptions, favorites
- **Trainer Dashboard**: Profile management, video uploads, analytics
- **Admin Dashboard**: User management, approvals, analytics

## 🛠️ Technology Stack

### Frontend
- **Angular 17+** with standalone components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Angular Animations** for smooth UX
- **RxJS** for reactive programming

### Backend
- **Node.js** runtime
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications

### DevOps & Deployment
- **Frontend**: Vercel/Netlify ready
- **Backend**: Heroku/Render ready
- **Database**: MongoDB Atlas compatible
- **Environment**: Docker support (optional)

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/gymverse
MONGODB_URI_PROD=mongodb+srv://...

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# App
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:4200

# File Upload
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Trainers
- `POST /api/trainers/register` - Trainer registration
- `GET /api/trainers` - Get all approved trainers
- `GET /api/trainers/:id` - Get trainer profile
- `PUT /api/trainers/:id` - Update trainer profile
- `POST /api/trainers/:id/videos` - Upload trainer videos

### Programs
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create program (Admin)
- `PUT /api/programs/:id` - Update program (Admin)
- `DELETE /api/programs/:id` - Delete program (Admin)

### Admin
- `GET /api/admin/pending-trainers` - Get pending trainer approvals
- `PUT /api/admin/trainers/:id/approve` - Approve trainer
- `PUT /api/admin/trainers/:id/reject` - Reject trainer
- `GET /api/admin/analytics` - Platform analytics

## 🎵 Media Integration

- **Background Music**: Toggle-able gym motivation tracks
- **Video Uploads**: Trainer content with secure storage
- **Image Gallery**: Lightbox-enabled photo showcase
- **Responsive Images**: Optimized for all devices

## 🚀 Deployment Guide

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to repository
3. Configure build settings:
   - Build Command: `ng build`
   - Output Directory: `dist/client`

### Backend (Render/Heroku)
1. Set environment variables
2. Configure start script: `npm start`
3. Set up MongoDB Atlas connection
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@gymverse.com
- Documentation: [Wiki](wiki-url)
- Issues: [GitHub Issues](issues-url)

---

**Built with ❤️ for the fitness community**

*Train Hard, Live Strong - GymVerse*
