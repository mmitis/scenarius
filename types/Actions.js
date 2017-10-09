const webdriver = require('selenium-webdriver');
const fs = require('fs');


const SUPPORTED_ACTIONS = ['type', 'click', 'wait', 'switchToFrame', 'changeTab', 'screenshot'];

class ActionHandler {

    /**
     * Executes selected scenario
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {*|Promise.<T>|Thenable.<R>}
     */
    static execute(driver, scenario, reporter) {
        let promised = null;
        if (SUPPORTED_ACTIONS.includes(scenario.getMethod())) {
            promised = this[scenario.getMethod()].bind(this, driver, scenario);
        } else {
            promised = Promise.resolve(true);
        }
        return promised;
    }

    /**
     * Waits selected number
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {promise.Promise.<void>}
     */
    static wait(driver, scenario) {
        return driver.sleep(scenario.getValue());
    }

    /**
     * Switch context into selected iframe (by css selector)
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {promise.Promise.<void>}
     */
    static switchToFrame(driver, scenario) {
        return this.getElement(driver, scenario.getSelector()).then((iFrame) => {
            return driver.switchTo().frame(iFrame);
        });
    }

    /**
     * Changes the window to the next opened tab
     * @param driver
     * @param scenario
     */
    static changeTab(driver, scenario) {
        const windows = driver.getWindowHandles();
        console.log(windows);
    }

    /**
     * Performs click on the selected object
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {promise.Promise.<void>}
     */
    static click(driver, scenario) {
        return this.getElement(driver, scenario.getSelector()).then((element) => {
            element.click();
            return element;
        });
    }

    /**
     * Writes data into selected input
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {Promise}
     */
    static type(driver, scenario) {
        return this.getElement(driver, scenario.getSelector()).then((element) => {
            element.sendKeys(scenario.getValue());
            return element;
        });
    }

    /**
     * Helper to get element by Css Selector
     * @param {WebDriver} driver - WebDriver object
     * @param {String} selector - CSS selector
     * @param {Number} time - maximum time to wait for render
     * @return {WebElementPromise}
     */
    static getElement(driver, selector, time = 3000) {
        return this.getWaitElement(driver, selector, time)
            .then(() => {
                const element = driver.findElement(webdriver.By.css(selector));
                return Promise.resolve(element);
            });
    }

    /**
     * Wait for the element to load
     * @param {WebDriver} driver - WebDriver object
     * @param {String} selector - CSS selector
     * @param {Number} time - maximum time to wait for render
     * @return {promise.Promise.<void>|promise.Promise.<T>|WebElementPromise|ManagedPromise.<T>|*}
     */
    static getWaitElement(driver, selector, time = 1000) {
        console.log('Waits for:', selector);
        return driver.wait(webdriver.until.elementLocated(webdriver.By.css(selector)), time);
    }

    /**
     * Performs Screenshot to the selected file
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {WebElementPromise}
     */
    static screenshot(driver, scenario) {
        return driver.takeScreenshot()
            .then(function (data) {
                fs.writeFileSync(scenario.getValue() + '.png', data.replace(/^data:image\/png;base64,/, ''), 'base64');
            });
    }


}

module.exports = ActionHandler;