'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global Device */
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function errorHandler(res) {
    return function (err) {
        res.serverError(500);
        console.log(err);
    };
}
var request = require('request');
var config = require('../../config');
function _index(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var id;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        id = process.env.DEVICE_ID;

                        if (id) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt('return', res.send(400));

                    case 3:
                        request.get(config.domain + '/api/getPiMetaData?id=' + id, function (err, resp, result) {
                            console.log('getting meta for igot', resp.body);
                            if (err) {
                                return res.send(500);
                            }
                            return res.send(resp.body);
                        });

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
function index(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _index(req, res).catch(errorHandler.bind(res));

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
}
exports.default = {
    index: index
};
module.exports = exports['default'];