import { By } from 'selenium-webdriver';

export default class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    this.logo = By.className('app_logo');
    this.sortDropdown = By.className('product_sort_container');
  }

  async getAppLogoText() {
    return await this.driver.findElement(this.logo).getText();
  }

  async sortProductsAZ() {
    const dropdown = await this.driver.findElement(this.sortDropdown);
    await dropdown.sendKeys('Name (A to Z)');
  }
}
