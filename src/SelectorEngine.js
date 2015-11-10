/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function SelectorEngine($context) {
    this.$context = $context;
}

SelectorEngine.prototype.select = function ($element, selector) {
    return this.$context.find(selector);
};

module.exports = SelectorEngine;
