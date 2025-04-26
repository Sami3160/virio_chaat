const express =require('express')
const cors=require('cors')
require('dotenv').config()

const connectDb=require('./config/db.config')
connectDb()
const app=express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


