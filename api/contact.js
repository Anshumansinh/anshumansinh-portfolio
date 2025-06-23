// api/contact.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async (req, res) => {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify your frontend domain for more security
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Parse JSON body if not already parsed
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            res.status(400).json({ message: 'Invalid JSON' });
            return;
        }
    }

    const { name, email, message } = body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        });
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};