const express = require('express')
const app = express()
require('dotenv').config()


//Routes
app.use('/',require('./Routes/mpesa'))

const PORT = process.env.PORT ;

app.listen(PORT,()=> console.log(`Server Started at port ${PORT}`)) 