const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log('FAILED URL:', response.url(), response.status());
    }
  });
  
  await page.goto('http://localhost:3000/admin/files', { waitUntil: 'networkidle0' });
  await browser.close();
})();
