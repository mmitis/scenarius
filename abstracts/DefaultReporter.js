class DefaultReporter {

    /**
     * Reports when suite has loaded the page
     * @param id
     * @param url
     * @returns {null}
     */
    static reportStart(id, url) {
        console.info('[TEST][%s][%s] Page loaded.(%s)', id, new Date().getTime(), url);
        return null;
    }

    /**
     * Reports action when executed
     * @param {String} id - unique id
     * @param {ScenarioObject} scenarioO - object of currenlty done object
     */
    static reportAction(id, scenarioO) {
        console.info('[TEST][%s][%s] %s %s performed with value %s ( for %s )',
            id, new Date().getTime(), scenarioO.getMethod(), scenarioO.getType(), scenarioO.getValue(), scenarioO.getSelector());
        return null;
    }

    /**
     * When any error appears
     * @param {String} id - unique id
     * @param {Error} error - catched error
     */
    static reportError(id, error){
        console.info('[TEST][%s][%s] Suite failed.',
            id, new Date().getTime(), error)
    }
}

module.exports = DefaultReporter;
