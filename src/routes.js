const { Router } = require('express');
const expressJWT = require('express-jwt');

const config = require('./config');
const auth = require('./controllers/auth');

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: config.JWT_ISSUER,
});

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/register', auth.register);

module.exports = routes;
