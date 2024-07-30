import express from "express";
import colors from "colors";
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import conn from "./config/db.js";
import authroutes from "./routes/authroute.js"
import categoryroute from "./routes/categoryroute.js"
import productroute from "./routes/productroute.js"
import orderroute from "./routes/orderroute.js";
const app=express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json())
app.use(morgan("dev"))
const corsOptions = {
    origin: 'https://cloud-pharmacy.vercel.app',
  };
  
  app.use(cors(corsOptions));
conn();
dotenv.config();
//routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/v1/auth",authroutes);
app.use("/api/v1/category",categoryroute)
app.use("/api/v1/product",productroute)
app.use("/api/v1/order", orderroute);
app.get("/",(req,res)=>{
    res.send({
        message:"welcome to cloud pharmacy"
    })
})
const PORT= process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode ${PORT}`.green);
})