# Rent Management System Backend

A robust backend API for a Rent Management System built with Node.js, Express, TypeScript, and PostgreSQL. This system enables landlords to manage tenants and properties efficiently while providing tenants with access to their profile information.

## 🚀 Live API

**Base URL:** [https://api-rms.onrender.com](https://api-rms.onrender.com)

**📚 Documentation Hub:** [https://api-rms.onrender.com/api/docs](https://api-rms.onrender.com/api/docs)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Landlords
- ✅ User registration with email verification
- ✅ Secure authentication with JWT tokens
- ✅ Add, view, and manage tenants
- ✅ Delete tenant records
- ✅ View all tenants associated with their properties
- ✅ Change password functionality
- ✅ Session management

### For Tenants
- ✅ Login with generated credentials
- ✅ View personal profile information
- ✅ Secure authentication

### System Features
- ✅ Role-based access control (Landlord/Tenant)
- ✅ Email notifications and verification
- ✅ Password hashing and security
- ✅ CORS enabled for frontend integration
- ✅ Clustering for improved performance
- ✅ Database migrations with Drizzle ORM

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer
- **Validation:** Custom validators
- **Development:** tsx, nodemon
- **Deployment:** Render

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sarojdhakal307/Rent-Management-System-Backend.git
   cd Rent-Management-System-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables (see [Environment Variables](#environment-variables))

4. **Run database migrations**
   ```bash
   npm run migration:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:8082` (or your specified PORT)

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8082
FRONTEND_URL=http://localhost:3000

# Database
DB_URL=postgresql://username:password@localhost:5432/rent_management

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration (for verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## 📚 API Documentation

### 🌐 Live Documentation
Access beautifully rendered documentation directly from your API:

- **📚 Documentation Hub**: [https://api-rms.onrender.com/api/docs](https://api-rms.onrender.com/api/docs)
- **📖 README (HTML)**: [https://api-rms.onrender.com/api/docs/readme/html](https://api-rms.onrender.com/api/docs/readme/html)
- **🔗 API Docs (HTML)**: [https://api-rms.onrender.com/api/docs/api/html](https://api-rms.onrender.com/api/docs/api/html)
- **📄 Raw Markdown**: Available at `/api/docs/readme` and `/api/docs/api`

For comprehensive API documentation including endpoints, request/response formats, and examples, see [docs.md](./docs.md) or visit the live documentation hub.

### ⚡ Quick API Overview

- **Base URL:** `https://api-rms.onrender.com/api`
- **Authentication:** Bearer token in Authorization header
- **Content-Type:** `application/json`

### Main Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check | No |
| POST | `/user/l/signup` | Landlord signup request | No |
| POST | `/user/l/signup-verify` | Verify landlord signup | No |
| POST | `/user/l/login` | Landlord login | No |
| GET | `/user/l/isLogedin` | Check landlord auth status | Yes |
| POST | `/user/l/addtenant` | Add new tenant | Yes (Landlord) |
| GET | `/user/l/alltenant` | Get all tenants | Yes (Landlord) |
| GET | `/user/l/tenant/:id` | Get specific tenant | Yes (Landlord) |
| DELETE | `/user/l/deletetenant/:id` | Delete tenant | Yes (Landlord) |
| PUT | `/user/l/changepassword` | Change landlord password | Yes (Landlord) |
| POST | `/user/t/login` | Tenant login | No |
| GET | `/user/t/myprofile` | Get tenant profile | Yes (Tenant) |

## 🗄 Database Schema

The system uses PostgreSQL with the following main tables:

### Landlord Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `username` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `address` (VARCHAR)
- `role` (ENUM: landlord)
- `createdAt` (TIMESTAMP)

### Tenant Table
- `id` (UUID, Primary Key)
- `fullname` (VARCHAR)
- `role` (ENUM: tenant)
- `permanentaddress` (VARCHAR)
- `document` (ENUM: passport, citizen, id)
- `documentnumber` (VARCHAR)
- `livingspacetype` (ENUM: flat, room)
- `livingspacenumber` (VARCHAR)
- `landlordid` (UUID, Foreign Key)
- `generatedspaceid` (VARCHAR, Unique)
- `generateddocid` (VARCHAR, Unique)
- `createdAt` (TIMESTAMP)

## 🏗️ Project Structure

The project follows a modular architecture with organized routing:

```
src/
├── index.ts              # Main application entry point
├── types.ts              # TypeScript type definitions
├── db/
│   ├── db_connect.ts     # Database connection
│   ├── migrate.ts        # Database migrations
│   └── schema.ts         # Database schema definitions
├── handlers/
│   ├── testHandlers.ts   # Test route handlers
│   └── userHandlers.ts   # User management handlers
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── lib.ts            # General utilities
│   └── mailServices.ts   # Email service functions
├── middlewares/
│   └── auth.ts           # Authentication middleware
└── router/
    ├── index.ts          # Main router setup
    ├── docs.ts           # Documentation routes (NEW!)
    └── user.ts           # User-related routes
```

### 🆕 New Documentation Router
The `docs.ts` router provides:
- **Landing page** with beautiful UI at `/api/docs`
- **HTML rendered docs** with GitHub styling
- **Raw markdown** endpoints for integration
- **Navigation between** different documentation sections

## 📜 Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Build and start production server

# Database
npm run migration:generate  # Generate new migration
npm run migration:migrate   # Run pending migrations

# Utility
npm run clean        # Clean dist folder
```

## 🚀 Deployment

This project is configured for deployment on Render with the following setup:

### Render Configuration (`render.yaml`)
```yaml
services:
  - type: web
    name: rent-management-backend
    runtime: node
    buildCommand: npm run build
    startCommand: node dist/index.js
    envVars:
      - key: NODE_VERSION
        value: 18
```

### Deployment Steps
1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy automatically on push to main branch

## 🔒 Security Features

- **Password Hashing:** Using bcrypt for secure password storage
- **JWT Authentication:** Stateless authentication with secure tokens
- **Role-based Access:** Different permissions for landlords and tenants
- **CORS Protection:** Configured for specific frontend origins
- **Input Validation:** Comprehensive validation for all inputs
- **SQL Injection Protection:** Using Drizzle ORM with parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or issues, please:
1. Check the [API documentation](./docs.md)
2. Look through existing GitHub issues
3. Create a new issue with detailed information

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 👨‍💻 Author

**Saroj Dhakal**
- GitHub: [@Sarojdhakal307](https://github.com/Sarojdhakal307)
- Email: sarojdhakal307@gmail.com

---

## 🎯 Upcoming Features

- [ ] Rent payment tracking
- [ ] Property management
- [ ] Maintenance request system
- [ ] Document upload functionality
- [ ] Notification system
- [ ] Dashboard analytics
- [ ] Mobile app support

---

**Made with ❤️ by Saroj Dhakal**
