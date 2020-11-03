const router = require('express').Router();
const {
  getAllArticles,
  getArticlesById, createArticles, deleteArticles,
} = require('../controllers/articles');
const { auth } = require('../middlewares/auth');
const { validateId, validateNewArticles } = require('../middlewares/requestValidator');

router.get('/articles', auth, getAllArticles);
router.post('/articles', auth, validateNewArticles, createArticles);
router.delete('/articles/:_id', auth, validateId, deleteArticles);
router.get('/articles/:_id', auth, validateId, getArticlesById);

module.exports = {
  router,
};
