/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var sinon = require('sinon'),
    CodeGenerator = require('../../src/CodeGenerator'),
    ExpressionEvaluator = require('../../src/ExpressionEvaluator');

describe('ExpressionEvaluator', function () {
    beforeEach(function () {
        this.codeGenerator = sinon.createStubInstance(CodeGenerator);
        this.jsep = sinon.stub();

        this.evaluator = new ExpressionEvaluator(this.jsep, this.codeGenerator);
    });

    describe('evaluate()', function () {
        it('should evaluate the generated code with the provided context', function () {
            var ast = {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'Identifier',
                    name: 'myValue'
                },
                right: {
                    type: 'Literal',
                    raw: 21
                }
            };
            this.jsep.withArgs('myValue + 21').returns(ast);
            this.codeGenerator.generate.withArgs(ast).returns('context.myValue + 21');

            expect(this.evaluator.evaluate('myValue + 21', {myValue: 2})).to.equal(23);
        });
    });
});
