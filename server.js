const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Verification = require('./models/Verification');

dotenv.config();

const app = express();
const PORT = 3005;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.post('/verify', async (req, res) => {
  const { username, messname } = req.body;

  // 📌 Dummy mess owner details (you can replace this with DB logic later)
  const ownerDetails = {
    ownerName: "Shubham Munde",
    mobile: "9876543210"
  };

  const verification = new Verification({
    username,
    messname,
    mobile: ownerDetails.mobile,
    address: "Default Address",
    email: "default@email.com"
  });

  await verification.save();

  const message = `
    New Verification Received:
    User Name: ${username}
    Mess Name: ${messname}
    Owner Name: ${ownerDetails.ownerName}
    Mobile: ${ownerDetails.mobile}
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ['shubhammumnde8767@gmail.com', 'piyushnipane74@gmail.com', 'dholeaishwarya258@gmail.com'],
    subject: 'New Mess Verification',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    // Send data back to frontend for popup
    res.status(200).json({
      ownerName: ownerDetails.ownerName,
      mobile: ownerDetails.mobile,
      messname: messname
    });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).send("Failed to send email");
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
