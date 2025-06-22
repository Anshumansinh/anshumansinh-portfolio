const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,       // Uses .env variable
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        });
    }

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: 'anshumansinh4423@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            text: message,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Email sending error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to send message'
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});