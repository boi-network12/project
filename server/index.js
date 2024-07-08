require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db")

// db connection
connection();

// middlewares 
app.use(express.json());
app.use(cors());

// routes  



const PORT = process.env.PORT || 2001
app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})