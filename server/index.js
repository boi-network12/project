require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db")

// db connection
connection();

// middlewares 
app.use(cors({
    origin: '*', // You can specify your frontend URL here for better security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({
    limit: "1mb"
}));

// import routes  
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const billPaymentRoutes = require("./routes/billPayments");
const notificationRoutes = require("./routes/notification");
const nextOfKinRoutes = require('./routes/nextOfKin');
const kycRoutes = require('./routes/kyc');
const savedCardRoutes = require('./routes/savedcard')

// use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/bill', billPaymentRoutes);
app.use('/notification', notificationRoutes);
app.use('/nextOfKin', nextOfKinRoutes);
app.use('/kyc', kycRoutes)
app.use('/saved-card', savedCardRoutes)

const PORT = process.env.PORT || 2001
app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})