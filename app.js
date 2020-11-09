const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const {
  PORT, dburl, dbconfig, limiter,
} = require('./config/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError.js');
const {
  notFoundRes,
} = require('./utils/constant');

mongoose.connect(dburl, dbconfig);

app.use(cors());
app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use(() => {
  throw new NotFoundError(notFoundRes);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
