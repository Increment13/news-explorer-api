const jwt = require('jsonwebtoken');
const { jwtsecret } = require('../config/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

// генерация ключа
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization
        && req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, jwtsecret);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
