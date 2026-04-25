require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json())

app.use('/api/contact', require('./routes/contact'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/debug-env', (req, res) => res.json({
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
  EMAIL_PASS_FIRST4: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.slice(0, 4) : null,
}))

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    console.log('Starting server without MongoDB (contact form will not persist data)')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
