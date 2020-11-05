const articleRouter = require('express').Router();
const {
  getAllArticles,
  getArticlesById, createArticles, deleteArticles,
} = require('../controllers/articles');
const { auth } = require('../middlewares/auth');
const { validateId, validateNewArticles } = require('../middlewares/requestValidator');

articleRouter.get('/', auth, getAllArticles);
articleRouter.post('/', auth, validateNewArticles, createArticles);
articleRouter.delete('/:_id', auth, validateId, deleteArticles);
articleRouter.get('/:_id', auth, validateId, getArticlesById);

module.exports = articleRouter;
