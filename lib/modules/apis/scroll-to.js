'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollTo = scrollTo;

var _helpers = require('../../helpers/');

var _utils = require('../utils/');

var _setPosition = require('./set-position');

/**
 * Scrolling scrollbar to position with transition
 * @public
 * @param {number} [x] - scrollbar position in x axis
 * @param {number} [y] - scrollbar position in y axis
 * @param {number} [duration] - transition duration
 * @param {function} [cb] - callback
 */
function scrollTo() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils.getPrivateProp.call(this, 'offset').x;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.getPrivateProp.call(this, 'offset').y;

    var _this = this;

    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var _ref = _utils.getPrivateProp.call(this),
        options = _ref.options,
        offset = _ref.offset,
        limit = _ref.limit,
        timerID = _ref.timerID;

    cancelAnimationFrame(timerID.scrollTo);
    cb = typeof cb === 'function' ? cb : function () {};

    if (options.renderByPixels) {
        // ensure resolved with integer
        x = Math.round(x);
        y = Math.round(y);
    }

    var startX = offset.x;
    var startY = offset.y;

    var disX = (0, _helpers.pickInRange)(x, 0, limit.x) - startX;
    var disY = (0, _helpers.pickInRange)(y, 0, limit.y) - startY;

    var curveX = (0, _helpers.buildCurve)(disX, duration);
    var curveY = (0, _helpers.buildCurve)(disY, duration);

    var totalFrame = curveX.length;
    var frame = 0;

    var scroll = function scroll() {
        if (frame === totalFrame) {
            _setPosition.setPosition.call(_this, x, y);

            return requestAnimationFrame(function () {
                cb(_this);
            });
        }

        _setPosition.setPosition.call(_this, startX + curveX[frame], startY + curveY[frame]);

        frame++;

        timerID.scrollTo = requestAnimationFrame(scroll);
    };

    scroll();
};