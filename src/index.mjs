import express from 'express';
import apiRouter from './api.mjs';

const apiServer = express();
const port = process.env.PORT || 3000;

apiServer.get('/', (req, res) => {
  res.send(`Express API is up & running at port ${port}`);
});

apiServer.all('*', function(req, res, next) {
    console.log('for all '+req.headers.origin);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

apiServer.use('/api', apiRouter);

apiServer.listen(port, () => {
  // eslint-disable-next-line
  console.log(`API listening at http://localhost:${port}`);
});

