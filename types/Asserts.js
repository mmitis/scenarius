const webdriver = require('selenium-webdriver');
const Actions = require('./Actions');
const SUPPORTED_ACTIONS = ['title', 'elementText', 'elementExist'];
const MAX_TIMEOUT = 500;

class AssertsHandler {

    static execute(driver, scenario) {
        let promised = null;
        if (SUPPORTED_ACTIONS.includes(scenario.getMethod())) {
            promised = this[scenario.getMethod()].bind(this, driver, scenario);
        } else {
            promised = Promise.resolve(true);
        }
        return promised.then((result) => result ? null : Promise.reject(scenario));
    }

    /**
     * Check title of the currently selected window
     * @param {WebDriver} driver - WebDriver object
     * @param {ScenarioObject} scenario - object of the scenario to execute
     * @return {promise.Promise.<void>}
     */
    static title(driver, scenario) {
        return driver.wait(function () {
            return driver.getTitle().then(function (title) {
                return scenario.getValue() === title;
            });
        }, MAX_TIMEOUT);
    }

    static elementText(driver, scenario) {
        return Actions.getElement(driver, scenario.getSelector())
            .then((element) => element.text() == scenario.getText());
    }

    static elementExist(driver, scenario) {
        return Actions.getElement(driver, scenario.getSelector())
            .then((element) => !!element);
    }

}

module.exports = AssertsHandler;