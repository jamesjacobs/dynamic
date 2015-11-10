/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var undef;

function OptionSet(optionReader, selectorEngine, behaviourName, $element, options) {
    this.behaviourName = behaviourName;
    this.$element = $element;
    this.optionReader = optionReader;
    this.options = options;
    this.selectorEngine = selectorEngine;
}

OptionSet.prototype.get = function (name, defaultValue) {
    var optionSet = this;

    return optionSet.optionReader.get(
        optionSet.$element,
        name,
        optionSet.behaviourName,
        defaultValue,
        optionSet.options
    );
};

OptionSet.prototype.select = function (name) {
    var optionSet = this,
        selector = optionSet.optionReader.get(
            optionSet.$element,
            name,
            optionSet.behaviourName,
            undef,
            optionSet.options
        );

    return optionSet.selectorEngine.select(optionSet.$element, selector);
};

module.exports = OptionSet;
