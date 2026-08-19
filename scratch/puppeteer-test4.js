const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3001/admin/files', { waitUntil: 'networkidle0' });
  
  // Wait for fetch to complete. Maybe networkidle0 is enough, but let's check for loading state.
  await page.waitForFunction(() => !document.body.innerText.includes('Loading files from R2...'), { timeout: 10000 });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Body text contains No files found:", text.includes('No files found in R2 Storage'));
  
  const rows = await page.$$eval('tbody tr', trs => trs.map(tr => tr.innerText).join('\n---\n'));
  console.log('Rows:\n', rows);

  await browser.close();
})();
