/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('lodash');

function Dynamic($, $context) {
    this.$ = $;
    this.behaviours = {
        // Default toggle behaviour: toggles the class "hide" on and off
        'toggle': function ($element, options, $context) {
            $context.find(options.get('toggle')).toggleClass('hide');
        }
    };
    this.$context = $context;
}

_.extend(Dynamic.prototype, {
    addBehaviour: function (name, handler) {
        var dynamic = this;

        dynamic.behaviours[name] = handler;

        return dynamic;
    },

    applyTo: function ($container) {
        var dynamic = this,
            $ = dynamic.$;

        _.each(dynamic.behaviours, function (handler, behaviourName) {
            $container.find('[data-dyn-' + behaviourName + ']').each(function () {
                var $element = $(this),
                    onEvent = $element.data('dyn-on'),
                    options = {
                        get: function (name) {
                            return $element.data('dyn-' + name);
                        }
                    };

                $element.on(onEvent, function () {
                    handler($element, options, dynamic.$context, $);
                });

                $element.trigger('init');
            });
        });

        dynamic.$context.find('script[type="text/x-dyn-json"]').each(function () {
            var json = $(this).html(),
                config = $.parseJSON(json);

            _.forOwn(config, function (elementConfig, selector) {
                $container.find(selector).each(function () {
                    var $element = $(this),
                        onEvent = elementConfig.on,
                        options = {
                            get: function (name) {
                                return elementConfig[name];
                            }
                        },
                        handler = dynamic.behaviours[elementConfig.behaviour];

                    if (!handler) {
                        throw new Error('No behaviour called "' + elementConfig.behaviour + '" is defined');
                    }

                    $element.on(onEvent, function () {
                        handler($element, options, dynamic.$context, $);
                    });

                    $element.trigger('init');
                });
            });
        });

        return dynamic;
    },

    use: function (plugin) {
        var dynamic = this;

        plugin(dynamic);

        return dynamic;
    }
});

module.exports = Dynamic;
