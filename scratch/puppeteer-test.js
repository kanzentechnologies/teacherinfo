const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000/admin/files', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  const rows = await page.$$eval('tbody tr', trs => trs.map(tr => tr.innerText).join('\n---\n'));
  console.log('Rows:\n', rows);
  
  await browser.close();
})();
