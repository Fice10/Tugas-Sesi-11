export default class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.inputUsername = { id: 'user-name' };
    this.inputPassword = { id: 'password' };
    this.buttonLogin = { id: 'login-button' };
  }

  async login(username, password) {
    await this.driver.findElement(this.inputUsername).sendKeys(username);
    await this.driver.findElement(this.inputPassword).sendKeys(password);
    await this.driver.findElement(this.buttonLogin).click();
  }
}
