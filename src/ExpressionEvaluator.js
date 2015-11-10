/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function ExpressionEvaluator(jsep, codeGenerator) {
    this.codeGenerator = codeGenerator;
    this.jsep = jsep;
}

ExpressionEvaluator.prototype.evaluate = function (expression, context) {
    var evaluator = this,
        ast = evaluator.jsep(expression),
        code = evaluator.codeGenerator.generate(ast);

    /*jshint evil: true */
    return new Function('context', 'return ' + code + ';')(context);
};

module.exports = ExpressionEvaluator;
