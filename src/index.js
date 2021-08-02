import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(config.PORT, () =>
  console.info(
    `App listening at http://localhost:${config.PORT}. Environment: ${config.ENV}`
  )
);
