const userRouter = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');

userRouter.get('/', async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: 'All fields are required',
    });
  } else if (password.length < 3) {
    res.status(403).json({
      error: 'password should be above 3 characters',
    });
  } else {
    const salt = 10;

    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
});

module.exports = userRouter;
