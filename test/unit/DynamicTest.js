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
    Dynamic = require('../../src/Dynamic'),
    OptionSet = require('../../src/OptionSet/OptionSet'),
    OptionSetFactory = require('../../src/OptionSet/OptionSetFactory');

describe('Dynamic', function () {
    beforeEach(function () {
        this.$html = $('<html></html>');
        this.$body = $('<body></body>').appendTo(this.$html);
        this.dataAttributeOptionSet = sinon.createStubInstance(OptionSet);
        this.objectOptionSet = sinon.createStubInstance(OptionSet);
        this.dataAttributeOptionSetFactory = sinon.createStubInstance(OptionSetFactory);
        this.objectOptionSetFactory = sinon.createStubInstance(OptionSetFactory);
        this.dataAttributeOptionSetFactory.create.returns(this.dataAttributeOptionSet);
        this.objectOptionSetFactory.create.returns(this.objectOptionSet);

        this.dynamic = new Dynamic(this.dataAttributeOptionSetFactory, this.objectOptionSetFactory, $, this.$html);
    });

    describe('addBehaviour()', function () {
        it('should provide a fluent interface', function () {
            expect(this.dynamic.addBehaviour('test', sinon.stub())).to.equal(this.dynamic);
        });
    });

    describe('applyTo()', function () {
        beforeEach(function () {
            this.callApplyTo = function () {
                this.dynamic.applyTo(this.$html);
            }.bind(this);
        });

        it('should provide a fluent interface', function () {
            expect(this.dynamic.applyTo($('<div></div>'))).to.equal(this.dynamic);
        });

        describe('when using a JSON config and the behaviour is not defined', function () {
            beforeEach(function () {
                this.$body.append(
                    [
                        '<div>',
                        '<button id="broken_button">Broken</button>',
                        '<p id="broken_message">Message to toggle</p>',
                        '<script type="text/x-dyn-json">',
                        '{',
                        '    "#broken_button": {',
                        '        "on": "custom.event",',
                        '        "behaviour": "oh_behave",',
                        '        "toggle": "#broken_message"',
                        '    }',
                        '}',
                        '</script>',
                        '</div>'
                    ].join('\n')
                );
                this.$message = this.$body.find('#broken_message');
                this.$toggleButton = this.$body.find('#broken_button');
            });

            it('should throw the expected error', function () {
                expect(function () {
                    this.callApplyTo();
                }.bind(this)).to.throw('No behaviour called "oh_behave" is defined');
            });
        });

        describe('when using data-* attribute config with a custom behaviour', function () {
            beforeEach(function () {
                this.$body.append(
                    [
                        '<div>',
                        '<button id="custom_button" data-dyn-custom-on="custom.event" data-dyn-custom="#custom_message">Custom</button>',
                        '<p id="custom_message">Message to (custom)</p>',
                        '</div>'
                    ].join('\n')
                );
                this.$message = this.$body.find('#custom_message');
                this.$customButton = this.$body.find('#custom_button');
            });

            describe('before the event occurs', function () {
                it('should have triggered one "init" event on the element', function () {
                    var handler = sinon.stub(),
                        onInit = sinon.spy();
                    this.dynamic.addBehaviour('custom', handler);
                    this.$customButton.on('init', onInit);

                    this.callApplyTo();

                    expect(onInit).to.have.been.calledOnce;
                });
            });

            describe('after the event occurs', function () {
                it('should pass the configured jQuery instance to the handler', function () {
                    var handler = sinon.stub();
                    this.dynamic.addBehaviour('custom', handler);
                    this.callApplyTo();

                    this.$customButton.trigger('custom.event');

                    expect(handler).to.have.been.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, $);
                });

                it('should pass the event object to the handler', function () {
                    var event = $.Event('custom.event'),
                        handler = sinon.stub();
                    this.dynamic.addBehaviour('custom', handler);
                    this.callApplyTo();

                    this.$customButton.trigger(event);

                    expect(handler).to.have.been.calledWith(
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.any,
                        sinon.match.same(event)
                    );
                });
            });
        });

        describe('when using data-* attribute config with a custom behaviour that doesn\'t support a default option', function () {
            beforeEach(function () {
                this.$body.append(
                    [
                        '<div>',
                        '<button id="custom_button" data-dyn-custom-on="custom.event">Custom</button>',
                        '<p id="custom_message">Message to (custom)</p>',
                        '</div>'
                    ].join('\n')
                );
                this.$message = this.$body.find('#custom_message');
                this.$customButton = this.$body.find('#custom_button');
            });

            it('should call the handler', function () {
                var handler = sinon.stub();
                this.dynamic.addBehaviour('custom', handler);
                this.callApplyTo();

                this.$customButton.trigger('custom.event');

                expect(handler).to.have.been.called;
            });
        });

        describe('when using a JSON config with a custom behaviour', function () {
            beforeEach(function () {
                this.$body.append(
                    [
                        '<div>',
                        '<button id="custom_button">Custom</button>',
                        '<p id="custom_message">Message to (custom)</p>',
                        '<script type="text/x-dyn-json">',
                        '{',
                        '    "#custom_button": {',
                        '        "on": "custom.event",',
                        '        "behaviour": "custom",',
                        '        "toggle": "#custom_message"',
                        '    }',
                        '}',
                        '</script>',
                        '</div>'
                    ].join('\n')
                );
                this.$message = this.$body.find('#custom_message');
                this.$customButton = this.$body.find('#custom_button');
            });

            it('should pass the configured jQuery instance to the handler', function () {
                var handler = sinon.stub();
                this.dynamic.addBehaviour('custom', handler);
                this.callApplyTo();

                this.$customButton.trigger('custom.event');

                expect(handler).to.have.been.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, $);
            });

            it('should pass the event object to the handler', function () {
                var event = $.Event('custom.event'),
                    handler = sinon.stub();
                this.dynamic.addBehaviour('custom', handler);
                this.callApplyTo();

                this.$customButton.trigger(event);

                expect(handler).to.have.been.calledWith(
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.any,
                    sinon.match.same(event)
                );
            });
        });
    });

    describe('use()', function () {
        it('should provide a fluent interface', function () {
            var stubPlugin = sinon.stub();

            expect(this.dynamic.use(stubPlugin)).to.equal(this.dynamic);
        });

        it('should call the plugin once', function () {
            var stubPlugin = sinon.stub();

            this.dynamic.use(stubPlugin);

            expect(stubPlugin).to.have.been.calledOnce;
        });

        it('should pass the Dynamic instance to the plugin', function () {
            var stubPlugin = sinon.stub();

            this.dynamic.use(stubPlugin);

            expect(stubPlugin).to.have.been.calledWith(this.dynamic);
        });
    });
});
