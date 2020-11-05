const router = require('express').Router();
const userRouter = require('./users');
const articleRouter = require('./articles');

router.use('/', userRouter);
router.use('/articles', articleRouter);

module.exports = router;
