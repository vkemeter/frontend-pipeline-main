(function ($) {
    "use strict";

    /**
     * a jquery plugin to access configured bootstrap breakpoints.
     *
     * see _body.scss, how to implement the breakpoints in your scss file
     *
     * usage:
     *      window.breakpoints returns all breakpoints available
     *      $.breakpoints.init(): the init method.
     *      $.breakpoints.getBreakpoint() returns the current active breakpoint
     *      $.breakpoints.breakpointDown('sm') returns true, if the given breakpoint (xs) is even or
     *      smaller than the current active breakpoint
     *
     * @type {Object}
     */
    $.breakpoints = new Object({

        init: function () {
            var options = {
                _selector: $('body'),
            };

            if (options._selector.css('content')) {
                var _breakpoints = options._selector.css('content').slice(1, -1);
                var _breakpoints = _breakpoints.split(',');
                var _keys = [];
                var _vals = [];

                $.each(_breakpoints, function (k, v) {
                    if (!parseInt(v) && v != 0) {
                        _keys.push(v);
                    } else {
                        _vals.push(v);
                    }
                });

                var _return = {};
                $.each(_keys, function (k, v) {
                    _return[v] = _vals[k];

                    if (k === 0) {
                        $('body').append('<i class="breakpoint d-block d-' + _keys[k + 1] + '-none" data-breakpoint="' + v + '" data-width="' + _vals[k] + '" />');
                    } else if (k === (_vals.length - 1)) {
                        $('body').append('<i class="breakpoint d-none d-' + v + '-block" data-breakpoint="' + v + '" data-width="' + _vals[k] + '" />');
                    } else {
                        $('body').append('<i class="breakpoint d-none d-' + v + '-block d-' + _keys[k + 1] + '-none" data-breakpoint="' + v + '" data-width="' + _vals[k] + '" />');
                    }
                });

                window.breakpoints = _return;
            }
        },

        // get current active breakpoint
        getBreakpoint: function () {
            var _return = 'XS';

            $('i.breakpoint').each(function () {
                if ($(this).is(':visible')) {
                    _return = $(this).data('breakpoint').toUpperCase();
                }
            });

            return _return;
        },

        // returns true, if the given breakpoint is even or smaller than the active
        // breakpoint. like the scss media-breakpoint-down() mixin
        breakpointDown: function (breakpoint) {
            return parseInt(window.breakpoints[breakpoint]) >= parseInt(window.breakpoints[this.getBreakpoint().toLowerCase()]);
        }
    });

})(jQuery);