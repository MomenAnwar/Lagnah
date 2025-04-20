const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')



const consumerPath = require('./routes/consumerRoute')
const transactionPath = require('./routes/transactionRoute')
const financePath = require('./routes/financeRoute')
const userPath = require('./routes/userRoute')
const messagePath = require('./routes/messageRoute')
const postRoute = require('./routes/postRoute')


require('dotenv').config()
const app = express()
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'https://lagnah-m4t06w35q-momenanwars-projects.vercel.app'], 
    credentials: true
}))
app.use(cookieParser())



app.use('/consumers', consumerPath)
app.use('/transactions', transactionPath)
app.use('/finance', financePath)
app.use('/users', userPath)
app.use('/messages', messagePath)
app.use('/posts', postRoute)



mongoose.connect(process.env.DATA_BASE_URL).then(()=> {
    console.log('connection successful');
})



const port = process.env.PORT || 4000


app.listen(port, ()=> {
    console.log(`Running on port ${port}`)
})