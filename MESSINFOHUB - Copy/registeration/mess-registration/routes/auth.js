const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Owner = require('../models/Owner');
const path = require('path');

router.post('/register', async (req, res) => {
  const { messName, ownerName, email, password, address, mobile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newOwner = new Owner({
    messName,
    ownerName,
    email,
    password: hashedPassword,
    address,
    mobile
  });

  try {
    await newOwner.save();
    res.redirect('/start.html');
  } catch (err) {
    console.log(err);
    res.send('Error registering');
  }
});
// Fake login simulation (for demo, no session)
let currentOwnerEmail = '';

router.post('/register', async (req, res) => {
  const { messName, ownerName, email, password, address, mobile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newOwner = new Owner({
    messName,
    ownerName,
    email,
    password: hashedPassword,
    address,
    mobile
  });

  try {
    await newOwner.save();
    currentOwnerEmail = email;
    res.redirect('/start.html');
  } catch (err) {
    res.send('Error registering');
  }
});

router.post('/edit', async (req, res) => {
  const { description, images } = req.body;
  try {
    await Owner.findOneAndUpdate({ email: currentOwnerEmail }, {
      description,
      images
    });
    res.send("Mess information updated successfully!");
  } catch (err) {
    res.send("Error updating information");
  }
});

module.exports = router;
