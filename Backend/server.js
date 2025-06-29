import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './config/ConnectDB.js';


const app = express();
dotenv.config()

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send("Server Starts....");
})

connectDB();

app.listen(5000,()=>{
    console.log(`Server listens at port: ${PORT}`)
})