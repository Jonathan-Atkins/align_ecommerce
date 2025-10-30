const url = 'http://localhost:3001/'; // dev server reported port 3001 in terminal

(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // emulate the attached viewport width
    await page.setViewport({ width: 718, height: 900 });

    // retry navigation a few times while the dev server starts
    let ok = false;
    for (let i = 0; i < 12; i++) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
        ok = true;
        break;
      } catch (err) {
        console.log(`goto attempt ${i} failed: ${err.message}`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    if (!ok) {
      console.error('Failed to load page after retries:', url);
      await browser.close();
      process.exit(1);
    }

    // allow any layout JS to run
    await page.waitForTimeout(800);

    const dims = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const logoImg = document.querySelector('img[alt="Align ecommerce logo"]');
      const homeLink = document.querySelector('a[href="/"]');
      // the links container is the parent element of the Home link in this markup
      const linksEl = homeLink ? homeLink.parentElement : null;
      const cta = document.querySelector('a[href="/contact"]');

      const navStyles = nav ? getComputedStyle(nav) : null;
      const paddingLeft = navStyles ? parseFloat(navStyles.paddingLeft || '0') : 0;
      const paddingRight = navStyles ? parseFloat(navStyles.paddingRight || '0') : 0;
      const availableWidth = nav ? nav.clientWidth - (paddingLeft + paddingRight) : null;

      const logoWidth = logoImg ? logoImg.getBoundingClientRect().width : null;
      const linksWidth = linksEl ? linksEl.getBoundingClientRect().width : null;
      const ctaWidth = cta ? cta.getBoundingClientRect().width : null;

      return {
        url: location.href,
        availableWidth,
        paddingLeft,
        paddingRight,
        logoWidth,
        linksWidth,
        ctaWidth,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      };
    });

    console.log('MEASURED_DIMENSIONS_START');
    console.log(JSON.stringify(dims, null, 2));
    console.log('MEASURED_DIMENSIONS_END');

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('script error', err);
    process.exit(2);
  }
})();
