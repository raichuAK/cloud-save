import express from 'express';
import bodyParser from 'body-parser';
import APIservice from './api/db.mjs';


const apiRouter = express.Router();
apiRouter.use( bodyParser.json());    
apiRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

apiRouter.get('/pages', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  const svc = new APIservice();
  const pages = await svc.getPages('all');
  res.type('json');
  console.log(`pages ${pages}`);
  res.send({pages});
});


apiRouter.get('/pages/one', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  const svc = new APIservice();
  console.log(`req.query.pageName ${req.query.pageName}`);
  console.log(`req.headers.origin ${req.headers.origin}`);
  const pageUrl = req.query.pageName ? req.query.pageName : ( req.headers.origin ? `${req.headers.origin}/` : ``);
  if(pageUrl) {
    const page = await svc.getPages([pageUrl]);
    res.type('json');
    console.log(`Page ${JSON.stringify(page)}`);
    if (page && page.length) {
      res.send({page});
    }else {
      res.send({page: []});
    }
  } else {
    res.sendStatus(404);
  }
});

apiRouter.post('/pages', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  const svc = new APIservice();
  const page = await svc.savePage(req.body);
  res.type('json');
  console.log(`Created Page ${page}`);
  res.send({done: 'saved', data: page});
});

export default apiRouter;