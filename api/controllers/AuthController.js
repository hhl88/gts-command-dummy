'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global User */
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
var request = require('request');
var config = require('../../config');
var jwt = require('jsonwebtoken');
var secret = 'V62HuT2EFx68';
function _createSession(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('Requesting auth from', config.domain);
                        request.post(config.domain + '/api/createSessionCommandApp', { form: req.body }, function (err, resp, result) {
                            if (err) {
                                console.log(err);
                                res.badRequest(400);
                                return;
                            }
                            res.cookie('accept_token', result, { maxAge: 100000000 * 60000 * 60000 });
                            res.ok();
                        });

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
function _getSession(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var decoded;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!req.cookies.accept_token) {
                            res.send(401);
                        }
                        _context2.prev = 1;
                        decoded = jwt.verify(req.cookies.accept_token, secret);

                        res.json(decoded.user);
                        return _context2.abrupt('return');

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](1);

                        console.log(_context2.t0);
                        res.send(401);
                        return _context2.abrupt('return');

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[1, 7]]);
    }));
}
function createSession(req, res) {
    _createSession(req, res).catch(function (err) {
        console.log(err);res.serverError();
    });
}
function getSession(req, res) {
    _getSession(req, res).catch(function (err) {
        console.log(err);res.serverError();
    });
}
exports.default = {
    createSession: createSession,
    getSession: getSession
};
module.exports = exports['default'];