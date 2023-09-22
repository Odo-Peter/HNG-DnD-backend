const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });
  else if (err.name === 'ValidationError')
    return res.status(400).send({ error: 'Please fill a valid email address' });
  else if (err.name === 'JsonWebTokenError')
    return res.status(400).json({ error: 'Invalid token' });
  else if (err.name === 'TokenExpiredError')
    return res.status(400).json({ error: 'Token expired' });
  else if (err.name === 'MongoServerError')
    return res.status(500).json({ error: 'Email should be unique' });
  else if (err.name === 'MongooseServerSelectionError')
    return res.status(500).json({ error: 'Check your network provider' });

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization' || 'Authorization');

  if (auth && auth.startsWith('Bearer ')) {
    const updatedAuth = auth.replace('Bearer ', '');

    req.token = updatedAuth;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.CRYPTO_KEY);

  if (!decodedToken) {
    return res.status(400).json({ error: 'Token invalid' });
  }
  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
