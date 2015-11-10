/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash'),
    undef;

function OptionReader(optionReader, expressionContext, expressionEvaluator) {
    this.expressionContext = expressionContext;
    this.expressionEvaluator = expressionEvaluator;
    this.optionReader = optionReader;
}

OptionReader.prototype.get = function ($element, name, behaviourName, defaultValue, elementConfig) {
    var reader = this,
        expressionContext,
        value = reader.optionReader.get($element, name, behaviourName, elementConfig),
        valueExpression;

    if (value === undef) {
        valueExpression = reader.optionReader.get($element, name + '-expr', behaviourName, elementConfig);

        if (valueExpression === undef) {
            if (defaultValue !== undef) {
                return defaultValue;
            }

            throw new Error('Neither "' + name + '" nor "' + name + '-expr" options were specified');
        }

        expressionContext = _.extend({}, reader.expressionContext, {
            '$this': $element
        });

        value = reader.expressionEvaluator.evaluate(valueExpression, expressionContext);
    }

    return value;
};

module.exports = OptionReader;
