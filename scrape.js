const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapScholar() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://scholar.google.com/citations?user=UY1UAKUAAAAJ&hl=en');

    const papers = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tr.gsc_a_tr')).map(row => ({
        title: row.querySelector('.gsc_a_at')?.innerText,
        link: row.querySelector('.gsc_a_at')?.href,
        year: row.querySelector('.gsc_a_y')?.innerText,
        citations: row.querySelector('.gsc_a_ac')?.innerText
      }));
    });

    // Save scraped data to a file
    fs.writeFileSync('data.json', JSON.stringify(papers, null, 2));
    return papers;
  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

scrapScholar();