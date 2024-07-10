require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db")

// db connection
connection();

// middlewares 
app.use(cors());
app.use(express.json());

// import routes  
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const billPaymentRoutes = require("./routes/billPayments");
const notificationRoutes = require("./routes/notification");

// use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/bill', billPaymentRoutes);
app.use('/notification', notificationRoutes);



const PORT = process.env.PORT || 2001
app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})