const userRouter = require('express').Router();
const {
  getUsersById, createUser,
  authUser,
  getUser,
} = require('../controllers/users');
const {
  validateLoginUser, validateCreateUser, validateId,
} = require('../middlewares/requestValidator');
const { auth } = require('../middlewares/auth');

userRouter.post('/signup', validateCreateUser, createUser);
userRouter.post('/signin', validateLoginUser, authUser);
userRouter.get('/users/me', auth, getUser);
userRouter.get('/users/:_id', auth, validateId, getUsersById);

module.exports = userRouter;
