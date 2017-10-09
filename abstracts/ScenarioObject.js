/**
 * Basic Scenario to execute class
 */
class ScenarioObject {

    constructor(params) {
        this.properties = Object.assign({}, {
            method: null,
            selector: 'body',
            value: null,
            type: null
        }, params);
    }

    getSelector() {
        return this.properties.selector;
    }

    getMethod() {
        return this.properties.method;
    }

    getValue() {
        return this.properties.value;
    }

    getType() {
        return this.properties.type;
    }

    log() {
        console.info('[%s] %s %s with value %s, ', this.properties.method.toUpperCase(), this.properties.method, this.properties.selector, this.properties.value);
    }

}

module.exports = ScenarioObject;
