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
    ObjectOptionReader = require('../../../src/OptionSet/ObjectOptionReader');

describe('ObjectOptionReader', function () {
    beforeEach(function () {
        this.$element = $('<div></div>');
        this.elementConfig = {
            'my-behaviour': 'root value',
            'arg1': 'value of arg1',
            'arg2': 'value of arg2',
            'evaled-arg-expr': 'my.expr === 2'
        };

        this.reader = new ObjectOptionReader();
    });

    describe('get()', function () {
        it('should be able to fetch the root value by the behaviour name', function () {
            expect(
                this.reader.get(this.$element, 'my-behaviour', 'my-behaviour', this.elementConfig)
            ).to.equal('root value');
        });

        it('should be able to fetch an argument for the behaviour by its name', function () {
            expect(
                this.reader.get(this.$element, 'arg1', 'my-behaviour', this.elementConfig)
            ).to.equal('value of arg1');
        });
    });
});
