const express =require('express')
const cors=require('cors')
require('dotenv').config()
const connectDb=require('./config/db.config')
connectDb()
const app=express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/notifications', require('./routes/notification.routes'))
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/sessions', require('./routes/sessions.routes'))
app.get('/ping',(req, res)=>res.json({message:'server is fine'}))


const PORT=process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})


