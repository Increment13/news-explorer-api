require('dotenv').config();
const rateLimit = require('express-rate-limit');

const {
  NODE_ENV,
  JWT_SECRET,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  PORT = 3000,
} = process.env;

const dburl = NODE_ENV !== 'production' ? 'mongodb://localhost:27017/newssearchdb' : `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const dbconfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const jwtsecret = NODE_ENV !== 'production' ? 'dev_secret' : JWT_SECRET;

const limitreq = NODE_ENV !== 'production' ? 999 : 15;

const limiter = rateLimit({
  windowMs: limitreq * 60 * 1000,
  max: 100,
});

module.exports = {
  PORT,
  dburl,
  dbconfig,
  jwtsecret,
  limiter,
};
