import {NextFunction, Response, Request} from 'express';
import mustache from 'mustache';
import {minify} from 'html-minifier';
import stripJs from 'strip-js';
import HTMLToPDF from 'html5-to-pdf';
import {Invoice_invoice} from './__generated__/Invoice';
import {getInvoice} from './utils';

function generateHtml(template: string, invoice: Invoice_invoice) {
  // const template = requireFile('./invoice.html');

  const view = {
    ...invoice,

    // Helpers
    // TODO: Find a community package for helpers instead of these
    nl2pbr: function() {
      return function(text: string, render: (text: string) => string) {
        return render(text)
          .split(/\s*\n\s*\n\s*/)
          .map(e => `<p>${e}</p>`)
          .join('')
          .replace(/\n/g, '<br />');
      };
    },
    nl2br: function() {
      return function(text: string, render: Function) {
        return render(text).replace(/\s*\n\s*/g, '<br />');
      };
    },
  };

  // Render the html invoice
  // https://www.npmjs.com/package/mustache
  let html = mustache.render(template, view);

  // Remove all JavaScript from the template
  // https://www.npmjs.com/package/strip-js
  html = stripJs(html, {preserveDoctypes: true});

  // Restrict HTML tags
  // https://www.npmjs.com/package/sanitize-html

  // Minify the HTML
  // https://www.npmjs.com/package/html-minifier
  return minify(html, {minifyCSS: true, collapseWhitespace: true});
}

async function generatePdf(template: string, invoice: Invoice_invoice) {
  const html = generateHtml(template, invoice);

  const htmlToPDF = new HTMLToPDF({
    inputBody: html,
    options: {
      pageSize: 'Letter',
      printBackground: true,
    },
    renderDelay: 1000,
  });

  return await new Promise((resolve, reject) => {
    htmlToPDF.build((error: Error, buffer: Buffer) => {
      if (error) reject(error);
      else resolve(buffer);
    });
  });
}

function generateJson(invoice: Invoice_invoice) {
  return invoice;
}

export function sendInvoice(format: 'json' | 'html' | 'pdf', template: string) {
  return async function json(req: Request, res: Response, next: NextFunction) {
    let invoice;

    try {
      invoice = await getInvoice(req.params.token);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }

    if (!invoice) {
      return next();
    }

    switch (format) {
      case 'json': {
        const fileName = `invoice ${invoice.sequenceNumber}.json`;

        res.set({
          'Content-Disposition': 'inline; filename=' + fileName,
        });

        res.send(generateJson(invoice));
        // res.json(generateJson(invoice));
        break;
      }

      case 'pdf': {
        const fileName = `invoice ${invoice.sequenceNumber}.pdf`;

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=' + fileName,
        });

        generatePdf(template, invoice).then(r => {
          res.send(r);
        });
        break;
      }

      case 'html': {
        res.send(generateHtml(template, invoice));
        break;
      }
    }
  };
}
