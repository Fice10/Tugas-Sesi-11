import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

import LoginPage from '../pages/page_login.js';
import InventoryPage from '../pages/inventoryPage.js';

describe('Saucedemo POM + Visual Test', function () {
  this.timeout(90000);

  let driver;
  let loginPage;
  let inventoryPage;

  beforeEach(async () => {
    const options = new Options();
    options.addArguments('--headless');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Visit SauceDemo, login, cek logo, urutkan produk', async function () {
    await driver.get('https://www.saucedemo.com');

    const title = await driver.getTitle();
    assert.strictEqual(title, 'Swag Labs');

    await loginPage.login('standard_user', 'secret_sauce');

    const buttonCart = await driver.wait(
      until.elementLocated(By.css('[data-test="shopping-cart-link"]')),
      10000
    );
    assert.ok(await buttonCart.isDisplayed());

    const logoText = await inventoryPage.getAppLogoText();
    assert.strictEqual(logoText, 'Swag Labs');

    await inventoryPage.sortProductsAZ();
    console.log('Urutkan produk berhasil.');
  });

  it('Visual Testing halaman login', async function () {
    await driver.get('https://www.saucedemo.com');

    const screenshot = await driver.takeScreenshot();
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    fs.writeFileSync('./screenshots/current.png', Buffer.from(screenshot, 'base64'));

    if (!fs.existsSync('./screenshots/baseline.png')) {
      fs.copyFileSync('./screenshots/current.png', './screenshots/baseline.png');
      console.log('Baseline image dibuat.');
    }

    const img1 = PNG.sync.read(fs.readFileSync('./screenshots/baseline.png'));
    const img2 = PNG.sync.read(fs.readFileSync('./screenshots/current.png'));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
      threshold: 0.1,
    });
    fs.writeFileSync('./screenshots/diff.png', PNG.sync.write(diff));

    assert.strictEqual(numDiffPixels, 0, `Ada perbedaan visual: ${numDiffPixels} piksel`);
  });
});