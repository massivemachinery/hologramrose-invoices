import puppeteer from 'puppeteer';

// Requires https://github.com/heroku/heroku-buildpack-google-chrome buildpack
// to work on Heroku
export default async function htmlToPdf(html: string) {
  const browser = await puppeteer.launch({
    // https://github.com/jontewks/puppeteer-heroku-buildpack
    // https://peter.sh/experiments/chromium-command-line-switches/
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // https://github.com/GoogleChrome/puppeteer/issues/422
  await page.goto('data:text/html,' + html, {waitUntil: 'networkidle2'});
  // await page.setContent(html);
  // await page.waitFor(1000);

  const pdfBuffer = await page.pdf({format: 'Letter', printBackground: true});
  await browser.close();

  return pdfBuffer;
}
