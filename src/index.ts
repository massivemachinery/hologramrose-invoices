import express from 'express';
import ensureRootUrl from 'ensure-root-url';

const port = process.env.PORT || '5000';
const rootUrl = process.env.ROOT_URL || 'http://localhost:5000';

async function server() {
  const app = express();

  app.use(ensureRootUrl(rootUrl));

  app.use('/*', (req, res) => {
    res.send('OK');
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
