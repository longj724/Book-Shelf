const puppeteer = require('puppeteer');

async function getStatus() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1500,
        height: 800,
        deviceScaleFactor: 1,
    })

    await page.goto('https://ccpl.overdrive.com/advanced-search');
    await page.click('#q');
    await page.keyboard.type('sapiens');
    await page.click('#advanced-search-form > div:nth-child(4) > div > button');
    await page.waitForSelector('.js-title-collection-view', {timeout: 5000});
    const booksWithTitle = await page.$$('[alt=\'Sapiens - ebook\']');
    booksWithTitle[0].click();
    await page.waitForSelector('.availability', {timeout: 5000});
    let title = await page.$eval('.availabilityText', text => text.innerHTML);
    title = title.replace(/\s/g, '');
    console.log(title)
    return title;
}

function add() {
    return 1 + 1;
}

module.exports = { getStatus, add };