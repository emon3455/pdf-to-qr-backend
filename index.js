const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


// middle ware:
app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("pdf to qr network is running...");
})


app.listen(port, (req,res)=>{
    console.log(`pdf to qr API is running on port: ${port}`);
})
