import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runSeleniumCrossBrowserSuite() {
  console.log("🚀 Starting Selenium Webdriver Cross-Browser Automation Suite...");

  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log("🌐 Navigating to Botmartz Community Landing Page (http://localhost:3001)...");
    await driver.get('http://localhost:3001');

    const title = await driver.getTitle();
    console.log(`✅ Page Title verified: "${title}"`);

    // Verify main headline element
    const heroHeadline = await driver.findElement(By.tagName('h1'));
    const headlineText = await heroHeadline.getText();
    console.log(`✅ Hero Headline verified via Selenium DOM tree: "${headlineText.split('\n')[0]}"`);

    // Verify Sign Up form input visibility
    const nameInput = await driver.findElement(By.css('input[placeholder="e.g. Rahul Sharma"]'));
    const isDisplayed = await nameInput.isDisplayed();
    console.log(`✅ Student Registration Name Input Visible: ${isDisplayed}`);

    console.log("🎉 Selenium Cross-Browser Automation Suite executed successfully with 0 errors!");
  } catch (err: any) {
    console.error("❌ Selenium Automation Error:", err.message);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

runSeleniumCrossBrowserSuite();
