const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.text({ type: '*/*' }));

app.post('/pdf', async (req, res) => {
  try {
    const html = req.body;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=documento.pdf',
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).send('Errore PDF: ' + err.message);
  }
});

app.get('/', (req, res) => res.send('🧾 Servizio PDF pronto!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`PDF service su http://localhost:${port}`));