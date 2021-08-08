const app = require('./server');

app.listen(config.PORT, () =>
  console.info(
    `App listening at http://localhost:${config.PORT}. Environment: ${config.ENV}`
  )
);
