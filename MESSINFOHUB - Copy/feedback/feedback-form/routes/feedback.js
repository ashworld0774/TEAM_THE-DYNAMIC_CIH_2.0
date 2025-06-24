const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

router.post('/feedback', async (req, res) => {
  const {
    name, email, mobile,
    q1, q1Other,
    q2, q2Other,
    q3, q3Other,
    finalFeedback,
    stars
  } = req.body;

  const feedback = new Feedback({
    name, email, mobile,
    q1, q1Other,
    q2, q2Other,
    q3, q3Other,
    finalFeedback,
    stars
  });

  try {
    await feedback.save();
    console.log(`📱 SMS sent to ${mobile}: Thanks for your feedback!`);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ashworld0774@gmail.com',
        pass: 'pjbc tyko qpxh uxrj'
      }
    });

    await transporter.sendMail({
      from: '"Feedback Team" <ashworld0774@gmail.com>',
      to: email,
      subject: "Thanks for your feedback!",
      text: `Hi ${name},\n\nThank you for submitting your feedback. We appreciate your input!\n\nBest regards,\nFeedback Team`
    });

    res.send('<h3>Thank you for your feedback!</h3>');
  } catch (err) {
    console.log("❌ Feedback Error:", err);
    res.send('Error submitting feedback');
  }
});

router.get('/all-feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ _id: -1 }).limit(10);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching feedbacks' });
  }
});

module.exports = router;
