const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../Models/Users');

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCheck =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user) {
    return res.status(401).json({
      error: 'Enter a registered email address',
    });
  } else if (!passwordCheck) {
    return res.status(401).json({
      error: 'Password does not match, try again',
    });
  } else if (!user && !passwordCheck) {
    return res.status(401).json({
      error: 'Credentials not valid, please verify',
    });
  }

  const userDetails = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userDetails, process.env.CRYPTO_KEY, {
    expiresIn: '24h',
  });

  res.status(200).send({
    token,
    email: user.email,
  });
});

module.exports = loginRouter;
