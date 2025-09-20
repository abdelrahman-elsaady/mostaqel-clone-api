const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const http = require('http');

const Ably = require('ably');

const ably = new Ably.Rest(process.env.ABLY_API_KEY);
app.set('ably', ably);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
}

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true
}));



const userRouter = require('./routes/users')
const messageRouter = require('./routes/messages')
const paymentRouter = require('./routes/payment')
const categoriesRouter = require('./routes/categories')
const proposalsRouter = require('./routes/proposals')
const reviewsRouter = require('./routes/reviews')
const projectRouter = require('./routes/project')
const complaintRoutes = require('./routes/Complaint');
const adminRoutes = require('./routes/Admin');
const Notification = require('./routes/Notification');
const skillRoutes = require('./routes/skills');
const portfolioRoutes = require('./routes/Portfolio');
const balanceRoutes = require('./routes/balance');
const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/messages');
const transactionRoutes = require('./routes/trnsactions');
const paypalRoutes = require('./routes/paypal');
const paymentRoutes = require('./routes/payment');
const earningRoutes = require('./routes/earning');
const platformEarningsRoutes = require('./routes/platformEarnings');
const imageRoutes = require('./routes/images');



connectDB();



app.use(express.json({ limit: '10mb' }));



app.use('/api/users', userRouter);
app.use('/api/messages', messageRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/projects', projectRouter);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/notifications', Notification);
app.use('/api/skills', skillRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/earning', earningRoutes);
app.use('/api/platformEarnings', platformEarningsRoutes);
app.use('/api/images', imageRoutes);


app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3344;

 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



