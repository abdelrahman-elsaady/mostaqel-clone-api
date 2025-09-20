# Mostaqel Backend API

[![CI/CD Pipeline](https://github.com/your-username/mostaqel-backend/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/mostaqel-backend/actions)
[![Coverage Status](https://codecov.io/gh/your-username/mostaqel-backend/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/mostaqel-backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust, production-ready backend API for a freelancing platform built with Node.js, Express, and MongoDB. This API provides comprehensive functionality for managing users, projects, payments, and real-time communication.

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Project Management**: Create, update, and manage freelance projects
- **Proposal System**: Freelancers can submit proposals for projects
- **Review System**: Rate and review freelancers and clients
- **Portfolio Management**: Showcase freelancer work and skills
- **Payment Integration**: PayPal and Stripe payment processing
- **Real-time Communication**: Socket.io for messaging and notifications
- **File Upload System**: Secure file handling with image optimization
- **Admin Dashboard**: Administrative controls and analytics

### Technical Features
- **RESTful API Design**: Clean, consistent API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Centralized error handling middleware
- **Rate Limiting**: Protection against abuse and DDoS
- **Security Headers**: Helmet.js for security best practices
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Database Optimization**: Efficient MongoDB queries with Mongoose
- **Image Processing**: Automatic image optimization with Sharp
- **Testing Suite**: Comprehensive test coverage with Jest
- **CI/CD Pipeline**: Automated testing and deployment

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Cloudinary for image processing and storage
- **Real-time**: Socket.io
- **Payments**: PayPal SDK, Stripe
- **Image Storage**: Cloudinary with automatic optimization
- **Security**: Helmet, express-rate-limit, CORS

### Development Tools
- **Testing**: Jest, Supertest
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)
- PayPal Developer Account (optional)
- Stripe Account (optional)
- Ably Account (for real-time features)
- Cloudinary Account (for image storage)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mostaqel-backend.git
   cd mostaqel-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   ```env
   MYDB=mongodb://localhost:27017/mostaqel
   PORT=3344
   NODE_ENV=development
   SECRET=your-super-secret-jwt-key-here
   ABLY_API_KEY=your-ably-api-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📁 Project Structure

```
mostaqel-backend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── config/
│   └── database.js         # Database configuration
├── controllers/            # Business logic controllers
├── middlewares/           # Custom middleware functions
│   ├── authorization.js   # JWT authentication
│   └── errorHandler.js    # Centralized error handling
├── models/                # MongoDB models
├── routes/                # API route definitions
├── services/              # Business logic services
├── tests/                 # Test files
│   ├── setup.js          # Test configuration
│   └── user.test.js      # User API tests
├── uploads/               # File upload directory
├── utils/                 # Utility functions
│   └── responseHelper.js  # API response helpers
├── .env.example          # Environment variables template
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest test configuration
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `PATCH /api/users/updatePassword` - Update password

### Users
- `GET /api/users/freelancers` - Get all freelancers
- `GET /api/users/clients` - Get all clients
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Proposals
- `GET /api/proposals` - Get all proposals
- `POST /api/proposals` - Submit proposal
- `PATCH /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal

### Payments
- `POST /api/payment/create-payment` - Create payment
- `POST /api/payment/execute-payment` - Execute payment
- `GET /api/payment/history` - Payment history

### Images
- `POST /api/images/upload` - Upload image to Cloudinary
- `DELETE /api/images/:public_id` - Delete image from Cloudinary
- `GET /api/images/transform/:public_id` - Get transformed image URL

### Health Check
- `GET /api/health` - API health status

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Protection against abuse (100 requests/15 minutes)
- **Security Headers**: Helmet.js for security best practices
- **CORS Protection**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data stored securely
- **SQL Injection Protection**: Mongoose ODM prevents NoSQL injection
- **XSS Protection**: Input sanitization and validation

## 🧪 Testing

The project includes comprehensive testing with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- user.test.js
```

### Test Coverage
- Unit tests for controllers
- Integration tests for API endpoints
- Error handling tests
- Authentication tests

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in your production environment:

```env
NODE_ENV=production
MYDB=mongodb+srv://username:password@cluster.mongodb.net/mostaqel
PORT=3344
SECRET=your-production-secret-key
ABLY_API_KEY=your-ably-api-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### Deployment Platforms

#### Heroku
1. Connect your GitHub repository
2. Set environment variables in Heroku dashboard
3. Deploy from main branch

#### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy automatically on push

#### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3344
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

- **Health Check**: `/api/health` endpoint for monitoring
- **Error Logging**: Centralized error handling with stack traces
- **Performance Monitoring**: Request timing and response codes
- **Database Monitoring**: Connection status and query performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "details": "Additional error details"
}
```

### Authentication

Include the JWT token in the Authorization header:

```
Authorization: your-jwt-token-here
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MongoDB connection string
   - Ensure MongoDB is running
   - Verify network connectivity

2. **JWT Token Issues**
   - Check SECRET environment variable
   - Verify token format and expiration
   - Ensure proper Authorization header

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits
   - Check multer configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Mostaqel Team
- **API Design**: RESTful architecture
- **Security**: Industry best practices
- **Testing**: Comprehensive coverage

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

---

**Made with ❤️ by the Mostaqel Team**
