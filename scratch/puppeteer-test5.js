const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/admin/files', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => !document.body.innerText.includes('Loading files from R2...'), { timeout: 10000 });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Full text:\n", text.substring(0, 500));
  
  await browser.close();
})();
