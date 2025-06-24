const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/messInfoAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Start server
const PORT = 3004;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
