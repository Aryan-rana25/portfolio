const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const Contact = require('../models/Contact')

const validate = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
]

router.post('/', validate, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, subject, message } = req.body

  try {
    const contact = await Contact.create({ name, email, subject, message })

    // Send notification email if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
        process.env.EMAIL_USER !== 'your_email@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        })
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `<h3>New message from ${name} (${email})</h3><p>${message}</p>`,
        })
        console.log('Email sent successfully')
      } catch (emailErr) {
        console.error('Email send error:', emailErr.message)
      }
    }

    res.status(201).json({ success: true, data: contact })
  } catch (err) {
    console.error('Contact save error:', err.message)
    res.status(500).json({ success: false, message: 'Server error, please try again.' })
  }
})

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
