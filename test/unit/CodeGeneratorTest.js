/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var CodeGenerator = require('../../src/CodeGenerator');

describe('CodeGenerator', function () {
    beforeEach(function () {
        this.generator = new CodeGenerator();
    });

    describe('generate()', function () {
        it('should return the expected code for the given binary expression AST', function () {
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

            expect(this.generator.generate(ast)).to.equal('(context.myValue + 21)');
        });

        it('should return the expected code for the given expression AST involving every node type', function () {
            var ast = {
                'type': 'BinaryExpression',
                'operator': '+',
                'left': {
                    'type': 'BinaryExpression',
                    'operator': '+',
                    'left': {
                        'type': 'BinaryExpression',
                        'operator': '+',
                        'left': {
                            'type': 'BinaryExpression',
                            'operator': '+',
                            'left': {
                                'type': 'Literal',
                                'value': 21,
                                'raw': '21'
                            },
                            'right': {
                                'type': 'MemberExpression',
                                'computed': false,
                                'object': {
                                    'type': 'Identifier',
                                    'name': 'a'
                                },
                                'property': {
                                    'type': 'Identifier',
                                    'name': 'b'
                                }
                            }
                        },
                        'right': {
                            'type': 'MemberExpression',
                            'computed': true,
                            'object': {
                                'type': 'Identifier',
                                'name': 'c'
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': 'd'
                            }
                        }
                    },
                    'right': {
                        'type': 'UnaryExpression',
                        'operator': '!',
                        'argument': {
                            'type': 'Identifier',
                            'name': 'e'
                        },
                        'prefix': true
                    }
                },
                'right': {
                    'type': 'ArrayExpression',
                    'elements': [
                        {
                            'type': 'Literal',
                            'value': 22,
                            'raw': '22'
                        },
                        {
                            'type': 'Literal',
                            'value': 23,
                            'raw': '23'
                        }
                    ]
                }
            };

            expect(this.generator.generate(ast)).to.equal('((((21 + context.a.b) + context.c[context.d]) + !context.e) + [22, 23])');
        });
    });
});
