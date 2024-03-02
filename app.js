const express = require('express')
const app = express()
require('dotenv').config()


//Routes
app.use('/', require('./Routes/mpesa'))
app.use('/dan',require('./Routes/dan'))

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> console.log(`Server Started at port ${PORT}`)) 