const router = require('express').Router();
const {
  getUsersById, createUser,
  authUser,
  getUser,
} = require('../controllers/users');
const {
  validateLoginUser, validateCreateUser, validateId,
} = require('../middlewares/requestValidator');
const { auth } = require('../middlewares/auth');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, authUser);
router.get('/users/me', auth, getUser);
router.get('/users/:_id', auth, validateId, getUsersById);

module.exports = {
  router,
};
