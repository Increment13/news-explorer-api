const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const articleRouter = require('./routes/articles').router;
const usersRouter = require('./routes/users').router;
const NotFoundError = require('./errors/NotFoundError.js');

const { NODE_ENV } = process.env;
const {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const dburl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
const dbconfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.connect(NODE_ENV === 'production' ? dburl : 'mongodb://localhost:27017/newssearchdb', dbconfig);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(usersRouter);
app.use(articleRouter);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
