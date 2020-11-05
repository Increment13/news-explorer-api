const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError.js');
const NotFoundError = require('../errors/NotFoundError.js');
const ForbiddenError = require('../errors/ForbiddenError.js');
const {
  notFound,
  badRequest,
  forbiddenError,
} = require('../utils/constant');

// Выгружаем новости пользователя
const getAllArticles = (req, res, next) => Article.find({ owner: { _id: req.user._id } })
  .populate(['owner'])
  .then((articles) => res.status(200).send(articles))
  .catch((err) => next(err));

// Поиск определенной новости
const getArticlesById = (req, res, next) => {
  const { _id } = req.params;

  Article.findOne({
    $and: [
      { _id },
      {
        owner:
      { _id: req.user._id },
      },
    ],
  })
    .populate(['owner'])
    .then((articles) => {
      if (!articles) {
        return next(new NotFoundError(notFound));
      }
      return res.status(200).send(articles);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequest));
      }
      return next(err);
    });
};

// Создание новости
const createArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: { _id: req.user._id },
  })
    .then((articles) => res.status(201).send(articles))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequest));
      }
      return next(err);
    });
};

// Удаление новости и проверка пользователя
const deleteArticles = (req, res, next) => {
  const { _id } = req.params;

  Article.findOne({ _id }).populate(['owner'])
    .then((articles) => {
      if (!articles) { return next(new NotFoundError(notFound)); }

      const owner = articles.owner._id.toString();

      if (owner !== req.user._id) {
        return next(new ForbiddenError(forbiddenError));
      }

      return Article.findByIdAndRemove(req.params, { new: true })
        .then(() => res.status(200).send({ message: 'Новость успешно удалена' }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllArticles,
  getArticlesById,
  createArticles,
  deleteArticles,
};
