import express from 'express';
import bodyParser from 'body-parser';
import APIservice from './api/db.mjs';


const apiRouter = express.Router();
apiRouter.use( bodyParser.json());    
apiRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

apiRouter.get('/pages', async (req, res) => {
  const svc = new APIservice();
  const pages = await svc.getPages('all');
  res.type('json');
  console.log(`pages ${pages}`);
  res.send({pages});
});


apiRouter.get('/pages/:pageName', async (req, res) => {
  const svc = new APIservice();
  const page = await svc.getPages([req.params.pageName]);
  res.type('json');
  console.log(`Page ${page}`);
  res.send({page});
});

apiRouter.post('/pages', async (req, res) => {
  const svc = new APIservice();
  const page = await svc.savePage(req.body);
  res.type('json');
  console.log(`Created Page ${page}`);
  res.send({done: 'saved', data: page});
});

export default apiRouter;