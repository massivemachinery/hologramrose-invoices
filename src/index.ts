import express from 'express';
import ensureRootUrl from 'ensure-root-url';
import {sendInvoice} from './middleware';
import {getTemplate} from './utils';

const port = process.env.PORT || '5000';
const rootUrl = process.env.ROOT_URL || 'http://localhost:5000/';

async function server() {
  const app = express();

  // Prettify JSON results
  app.set('json spaces', 2);

  app.use(ensureRootUrl(rootUrl));

  app.use('/favicon.ico', async (req, res, next) => {
    return next();
  });

  const template = await getTemplate();

  // Invoice endpoints
  app.get('/(:token).json', sendInvoice('json', template));
  app.get('/(:token).pdf', sendInvoice('pdf', template));
  app.get('/(:token)(.html)?', sendInvoice('html', template));

  app.listen(Number(port));
}

(async function() {
  try {
    await server();
    console.log(`🌹 -> HTTP server running on ${rootUrl} (port ${port})`);
  } catch (error) {
    console.error(error);
  }
})();
