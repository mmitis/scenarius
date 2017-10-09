class DefaultReporter {

    static reportStart(id, suite) {
        console.info('[TEST][%s][%s][%s] Page loaded.', id, new Date().getTime(), suite.url);
        return null;
    }

    static reportAction(id, scenarioO) {

    }

    static reportExecution(id, scenarioO) {

    }
}

module.exports = DefaultReporter;
