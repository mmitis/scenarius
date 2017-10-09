const webdriver = require('selenium-webdriver');
const Actions = require('./types/Actions');
const Asserts = require('./types/Asserts');
const ScenarioObject = require('./abstracts/ScenarioObject');
const DefaultReporter = require('./abstracts/DefaultReporter');

class Scenarius {

    /**
     *
     * @param params
     */
    constructor(params, reporter = DefaultReporter) {
        const defaults = {
            seleniumServer: 'http://localhost:4444/wd/hub',
            screen: {
                width: 1920,
                height: 1080
            },
        };

        this.methods = {
            ACTION: Actions,
            ASSERT: Asserts

        };
        this.reporter = reporter;
        params = Object.assign({}, defaults, params);
        this.server = this.initializeChromeServer(params.screen.width, params.screen.height, params.seleniumServer, params.options)
    }

    executeSuite(url, suite) {
        let suiteId = this.generateSuiteId();
        console.log('Scenario executed!');
        let promised = this.server.get(url).then(() => {
            this.reporter.reportStart(suiteId, url, suite);
        });
        suite.forEach((scenario) => {
            let scenarioItem = new ScenarioObject(scenario);
            if (this.methods[scenarioItem.getType().toUpperCase()]) {
                promised = promised.then(this.methods[scenarioItem.getType().toUpperCase()].execute(this.server, scenarioItem));
            } else {
                promised = promised.then(Promise.reject(new Error('Invalid type of the method')));
            }
        });
        return promised.then(() => {
            console.log('Finished!');
        });
    }

    closeServer() {
        this.server.quit();
    }


    initializeChromeServer(width, height, address, options) {
        const chromeOptions = options || {};
        const chromeCapabilities = webdriver.Capabilities.chrome();
        chromeCapabilities.set('chromeOptions', chromeOptions);
        const driver = new webdriver.Builder()
            .usingServer(address)
            .withCapabilities(chromeCapabilities)
            .build();
        driver.manage().window().setSize(width, height);
        return driver;
    }

    generateSuiteId() {
        return Math.random().toString(36).slice(5).substr(0, 5).toUpperCase();
    }
}

module.exports = Scenarius;