/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash');

function CodeGenerator() {

}

CodeGenerator.prototype.generate = function (ast) {
    function generateFrom(node, parent) {
        var args;

        if (node.type === 'BinaryExpression') {
            return '(' +
                generateFrom(node.left, node) + ' ' +
                node.operator + ' ' +
                generateFrom(node.right, node) +
                ')';
        }

        if (node.type === 'CallExpression') {
            args = _.map(node.arguments, function (argNode) {
                return generateFrom(argNode, node);
            });

            return generateFrom(node.callee, node) + '(' + args.join(', ') + ')';
        }

        if (node.type === 'UnaryExpression') {
            return node.operator + generateFrom(node.argument, node);
        }

        if (node.type === 'MemberExpression' && node.computed) {
            return generateFrom(node.object, node) + '[' + generateFrom(node.property, node) + ']';
        }

        if (node.type === 'MemberExpression' && !node.computed) {
            return generateFrom(node.object, node) + '.' + generateFrom(node.property, node);
        }

        if (node.type === 'ArrayExpression') {
            return '[' +
                _.map(node.elements, function (elementNode) {
                    return generateFrom(elementNode, node);
                }).join(', ') +
                ']';
        }

        if (node.type === 'Literal') {
            return node.raw;
        }

        if (node.type === 'Identifier') {
            if (parent.type === 'MemberExpression' && node === parent.property && !parent.computed) {
                return node.name;
            }

            return 'context.' + node.name;
        }

        if (node.type === 'ConditionalExpression') {
            return '(' + generateFrom(node.test, node) + ' ? ' +
                generateFrom(node.consequent, node) + ' : ' +
                generateFrom(node.alternate, node) +
                ')';
        }
    }

    return generateFrom(ast);
};

module.exports = CodeGenerator;
