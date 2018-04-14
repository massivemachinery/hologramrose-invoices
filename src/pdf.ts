import puppeteer from 'puppeteer';

export default async function htmlToPdf(html: string) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.waitFor(1000);

  const pdfBuffer = await page.pdf({format: 'Letter', printBackground: true});
  await browser.close();

  return pdfBuffer;
}
