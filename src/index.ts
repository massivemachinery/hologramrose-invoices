import express from 'express';

const port = process.env.PORT || '5000';

async function server() {
  const app = express();

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
