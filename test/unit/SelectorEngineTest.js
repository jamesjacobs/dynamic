/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var $ = require('jquery'),
    SelectorEngine = require('../../src/SelectorEngine');

describe('SelectorEngine', function () {
    beforeEach(function () {
        this.$context = $([
            '<div>',
            '<div id="element"></div>',
            '<p id="pElement" class="p-element"></p>',
            '</div>'
        ].join(''));
        this.$element = this.$context.find('#element');
        this.$pElement = this.$context.find('#pElement');

        this.engine = new SelectorEngine(this.$context);
    });

    describe('select()', function () {
        it('should support a simple selector relative to the context, outside the element', function () {
            expect(this.engine.select(this.$element, '.p-element').is(this.$pElement)).to.be.true;
        });
    });
});
