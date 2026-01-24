
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    console.log('Received contact form:', { name, email, subject });
    
    try {
        // Create transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email to you (Abhik)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'abhikkonar34@gmail.com', // Your email
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Sent from your portfolio website</p>
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Optional: Send confirmation to user
        const userConfirmation = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Abhik Konar',
            html: `
                <h2>Thank you for your message!</h2>
                <p>Dear ${name},</p>
                <p>I have received your message and will get back to you soon.</p>
                <p>Best regards,</p>
                <p><strong>Abhik Konar</strong></p>
                <hr>
                <p><em>This is an automated response.</em></p>
            `
        };
        
        await transporter.sendMail(userConfirmation);
        
        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully!' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}`);
});
