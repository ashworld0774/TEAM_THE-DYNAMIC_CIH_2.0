const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Feedback = require('./models/Feedback');

dotenv.config();

const app = express();
const PORT = 3008;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ No deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Thank-you email using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

app.post('/submit-feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: req.body.email,
      subject: 'Thanks for Your Feedback!',
      text: `Dear ${req.body.name},\n\nThank you for your valuable feedback on our website!\n\nRegards,\nTeam`
    });

    res.status(200).json({ message: "Feedback submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all feedbacks
app.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ date: -1 });
  res.json(feedbacks);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "feedback.html"));
});
