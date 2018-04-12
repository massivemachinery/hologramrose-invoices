import express from 'express';
import ensureRootUrl from 'ensure-root-url';
import {sendInvoice} from './middleware';
import {getTemplate} from './utils';

const PORT = process.env.PORT || '5000';

// HEROKU_APP_NAME is only set for review apps, change the ROOT_URL
// dynamically for review apps
// https://devcenter.heroku.com/articles/github-integration-review-apps#heroku_app_name-and-heroku_parent_app_name
const ROOT_URL = process.env.HEROKU_APP_NAME
  ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
  : process.env.ROOT_URL || 'http://localhost:5000/';

async function server() {
  const app = express();

  // Prettify JSON results
  app.set('json spaces', 2);

  app.use(ensureRootUrl(ROOT_URL));

  app.use('/favicon.ico', async (req, res, next) => {
    return next();
  });

  const template = await getTemplate();

  // Invoice endpoints
  app.get('/(:token).json', sendInvoice('json', template));
  app.get('/(:token).pdf', sendInvoice('pdf', template));
  app.get('/(:token)(.html)?', sendInvoice('html', template));

  app.listen(Number(PORT));
}

(async function() {
  try {
    await server();
    console.log(`🌹 -> HTTP server running on ${ROOT_URL} (port ${PORT})`);
  } catch (error) {
    console.error(error);
  }
})();
