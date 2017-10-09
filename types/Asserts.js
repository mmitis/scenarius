const webdriver = require('selenium-webdriver');
const SUPPORTED_ACTIONS = ['title'];
const MAX_TIMEOUT = 500;

class AssertsHandler {

    static execute(driver, scenario, options) {
        let promised = null;
        if (SUPPORTED_ACTIONS.includes(scenario.getMethod())) {
            promised = this[scenario.getMethod()](driver, scenario);
        } else {
            console.warn('Unsupported method', scenario);
            promised = Promise.resolve(true);
        }
        return promised.catch(() => {
            options.catchScreenFile && this.screenshot(driver, {
                value: options.catchScreenFile
            } );
        });
    }

    /**
     * Check title of the currently selected window
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {promise.Promise.<void>}
     */
    static title(driver, scenario){
        return driver.wait(function() {
            return driver.getTitle().then(function(title) {
                return scenario.getValue() === title;
            });
        }, MAX_TIMEOUT);
    }

}

module.exports = AssertsHandler;