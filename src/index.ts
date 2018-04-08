import express from 'express';
import ensureRootUrl from 'ensure-root-url';
import fetch from 'node-fetch';

const port = process.env.PORT || '5000';
const rootUrl = process.env.ROOT_URL || 'http://localhost:5000';

async function getTemplate() {
  const response = await fetch(
    'https://s3.amazonaws.com/hologramrose-staging/invoice.html',
  );
  return response.text();
}

async function server() {
  const template = await getTemplate();
  const app = express();

  app.use(ensureRootUrl(rootUrl));

  app.use('/favicon.ico', async (req, res) => {
    res.send(404);
  });

  app.use('/:invoiceUrlId', (req, res) => {
    console.log(req.params.invoiceUrlId);
    res.send(template);
  });

  app.listen(Number(port));
}

(async function() {
  try {
    await server();
    console.log(`-> HTTP server running on port ${port}`);
  } catch (error) {
    console.error(error);
  }
})();
