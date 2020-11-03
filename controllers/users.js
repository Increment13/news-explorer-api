const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const UnauthorizedError = require('../errors/UnauthorizedError.js');
const NotFoundError = require('../errors/NotFoundError.js');

const { JWT_SECRET = 'dev-jwt-secret' } = process.env;
const SALT_ROUNDS = 10;

// Авторизация пользователя
const authUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return next(new UnauthorizedError('Некорректный email или пароль'));

      return bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) return next(new UnauthorizedError('Некорректный email или пароль'));

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).send({ token });
      });
    })
    .catch((err) => next(err));
};

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => User.findOne({ email })
    .then((user) => {
      if (user) return next(new ConflictError('Пользователь с таким Email уже существует'));

      return User.create({
        email, password: hash, name,
      })
        .then(() => res.status(200).send({ message: `Пользователь ${email} успешно создан` }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Переданы некорректные данные'));
          }
          return next(err);
        });
    })
    .catch((err) => next(err)));
};

// its working
const getUser = (req, res, next) => User.findById({ _id: req.user._id })
  .then((user) => res.status(200).send(user))
  .catch((err) => next(err));

// its working
const getUsersById = (req, res, next) => User.findById({ _id: req.params._id })
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Запрашиваемые данные не найдены'));
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  });

module.exports = {
  getUsersById,
  createUser,
  authUser,
  getUser,
};
