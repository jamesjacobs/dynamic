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
    sinon = require('sinon'),
    ExpressionEvaluator = require('../../../src/ExpressionEvaluator'),
    ObjectOptionReader = require('../../../src/OptionSet/ObjectOptionReader'),
    OptionReader = require('../../../src/OptionSet/OptionReader');

describe('OptionReader', function () {
    beforeEach(function () {
        this.$element = $('<div></div>');
        this.expressionContext = {
            myArg: 21
        };
        this.expressionEvaluator = sinon.createStubInstance(ExpressionEvaluator);
        this.optionReader = sinon.createStubInstance(ObjectOptionReader);
        this.optionReader.get.withArgs(sinon.match.any, 'my-behaviour', 'my-behaviour').returns('root value');
        this.optionReader.get.withArgs(sinon.match.any, 'arg1', 'my-behaviour').returns('value of arg1');
        this.optionReader.get.withArgs(sinon.match.any, 'arg2', 'my-behaviour').returns('value of arg2');
        this.optionReader.get.withArgs(sinon.match.any, 'evaled-arg-expr', 'my-behaviour').returns('my.expr === 2');

        this.reader = new OptionReader(this.optionReader, this.expressionContext, this.expressionEvaluator);
    });

    describe('get()', function () {
        it('should be able to fetch the root value by the behaviour name', function () {
            expect(this.reader.get(this.$element, 'my-behaviour', 'my-behaviour')).to.equal('root value');
        });

        it('should be able to fetch an argument for the behaviour by its name', function () {
            expect(this.reader.get(this.$element, 'arg1', 'my-behaviour')).to.equal('value of arg1');
        });

        it('should support evaluated expressions', function () {
            this.expressionEvaluator.evaluate.withArgs('my.expr === 2').returns('my evaled result');

            expect(this.reader.get(this.$element, 'evaled-arg', 'my-behaviour')).to.equal('my evaled result');
        });

        it('should pass the context to the evaluator', function () {
            this.expressionEvaluator.evaluate.returns('my evaled result');

            this.reader.get(this.$element, 'evaled-arg', 'my-behaviour');

            expect(this.expressionEvaluator.evaluate)
                .to.have.been.calledWith('my.expr === 2', sinon.match({myArg: 21}));
        });

        it('should pass the element in the context as $this', function () {
            this.expressionEvaluator.evaluate.returns('my evaled result');

            this.reader.get(this.$element, 'evaled-arg', 'my-behaviour');

            expect(this.expressionEvaluator.evaluate)
                .to.have.been.calledWith('my.expr === 2', sinon.match({'$this': this.$element}));
        });

        it('should return the default when specified and neither the arg nor its expression variant are present', function () {
            expect(this.reader.get(this.$element, 'unspecified-arg', 'my-behaviour', 'my default value'))
                .to.equal('my default value');
        });

        it('should throw when neither the arg nor its expression variant are present with no default', function () {
            expect(function () {
                this.reader.get(this.$element, 'invalid-arg', 'my-behaviour');
            }.bind(this)).to.throw(
                'Neither "invalid-arg" nor "invalid-arg-expr" options were specified'
            );
        });
    });
});
