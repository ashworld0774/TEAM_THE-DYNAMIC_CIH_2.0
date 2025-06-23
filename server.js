const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');

const app = express();

const PORT = 3002;

mongoose.connect('mongodb://127.0.0.1:27017/signupLoginDB')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send('<script>alert("User already exists!"); window.location="/signup.html";</script>');
        }
        const newUser = new User({ name, email, mobile, password });
        await newUser.save();
        res.redirect('/login.html');
    } catch (err) {
        res.send('Error occurred');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.redirect('/main.html');
        } else {
            res.send('<script>alert("Invalid Credentials"); window.location="/login.html";</script>');
        }
    } catch (err) {
        res.send('Error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

