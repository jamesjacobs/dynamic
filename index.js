/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var Dynamic = require('./src/Dynamic');

module.exports = {
    create: function ($) {
        return new Dynamic($, $('html'));
    }
};
