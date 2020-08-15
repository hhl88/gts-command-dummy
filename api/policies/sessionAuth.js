'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global User */

var jwt = require('jsonwebtoken');
var secret = 'V62HuT2EFx68';

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.cookies.accept_token) {
              res.send(401);
            }

            _context.prev = 1;

            jwt.verify(req.cookies.accept_token, secret);
            next();
            return _context.abrupt('return');

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

            console.log(_context.t0);
            res.send(401);
            return _context.abrupt('return');

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 7]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports['default'];