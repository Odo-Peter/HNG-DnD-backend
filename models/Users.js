const logger = require('../utils/logger');
const config = require('../utils/config');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;

logger.info('connecting to ..... MONGODB');

//connecting to the DB
mongoose
  .connect(url)
  .then(() => logger.info('Connected to MONGODB'))
  .catch((err) => logger.error('Error connecting to MONGODB', err));

//the userSchema

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
