'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.executeCommandSpawn = executeCommandSpawn;
exports.resetPi = resetPi;
exports.index = index;

var _fsExtra = require('fs-extra');

var fs = _interopRequireWildcard(_fsExtra);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @Author: Igor Fischer <igor>
 * @Date:   2016-03-17T17:20:25+01:00
 * @Last modified by:   igor
 * @Last modified time: 2016-04-09T11:09:12+02:00
 */
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
    console.log('errorHandler 1');
    return function (err) {
        res.serverError(500);
        console.log('errorHandler 2', err);
    };
}
function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
}
function getSecondsBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return diff / 6000;
}

var config = require('../../config');
var commandApi = require('../commandApi');
var serverResponder = new commandApi.ServerApi();
var chproc = require('child_process');
var isPi = Boolean(process.env.APPONPI) || true;
// const isPi = false;
console.log('Start on raspi', isPi);
var queue = { executing: false, time: null };
function retry(fn) {
    console.log('Check if nothing is executing');
    if (queue.executing) {
        var diff = getMinutesBetweenDates(queue.time, new Date());
        if (diff >= 2) {
            fn();
        } else {
            console.log('Negative - waiting');
            setTimeout(retry.bind({}, fn), 1000);
        }
    } else {
        queue = {
            executing: true,
            time: new Date()
        };
        console.log('Positive - go, go');
        fn();
    }
}
function _index(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var command, exec, toExec, start, fn;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        command = req.query;

                        console.log('_index_', command);
                        if (!command && command.role) {
                            res.badRequest('No command send.');
                        }
                        if (!(command.role in serverResponder)) {
                            res.badRequest('No such command.');
                        }
                        exec = serverResponder[command.role](command);
                        toExec = exec;

                        if (!isPi) {
                            // toExec = `ssh -o StrictHostKeyChecking=no pi@185.48.118.115 -p ${config.remotePiPort} "${exec}"`;
                            toExec = 'ssh -o StrictHostKeyChecking=no pi@172.27.4.63 "' + exec + '"';
                        }
                        console.log('Executing:', toExec);
                        start = new Date();

                        fn = function fn() {
                            return chproc.exec(toExec, function (err, out, code) {
                                console.log(err, out, code);
                                var end = new Date();
                                var mes = {
                                    out: out,
                                    code: code,
                                    err: err,
                                    exec: exec,
                                    duration: getSecondsBetweenDates(start, end),
                                    requestBody: command
                                };
                                res.json(mes);
                                queue = {
                                    executing: false,
                                    time: null
                                };
                            });
                        };

                        retry(fn);

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
function addToQueue(obj) {
    console.log('DATA', obj.data);
}
var spawn = require('child_process').spawn;
function executeCommandSpawn(com, cat) {
    var isScript = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isSudo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', new Promise(function (res, rej) {
                            var toExec = isSudo ? 'sudo ' + com.trim() : com.trim();
                            var pr = void 0;
                            var stats = void 0;
                            try {
                                console.log('executeCommandSpawn');
                                console.log('com', com.trim());
                                console.log('cat', cat);
                                console.log('isScript', isScript);
                                console.log('isSudo', isSudo);
                                // check if file exists, because spawn break whole app when not
                                if (isScript) {
                                    stats = fs.lstatSync(com.trim());
                                }
                                if (!isPi) {
                                    // toExec = `ssh -o StrictHostKeyChecking=no pi@185.48.118.115 -p ${config.remotePiPort} "${com.trim()}"`;
                                    toExec = 'ssh -o StrictHostKeyChecking=no pi@172.27.4.63 -p ' + config.remotePiPort + ' "' + com.trim() + '"';
                                }
                                console.log('SPAWN:', toExec);
                                pr = spawn(toExec, opts);
                            } catch (e) {
                                console.log('ERROR:', e);
                                rej(e);
                                return;
                            }
                            pr.stdout.on('data', function (d) {
                                return addToQueue({ cat: cat, data: d.toString(), stage: 'data', timestamp: new Date() });
                            });
                            pr.stderr.on('data', function (d) {
                                return addToQueue({ cat: cat, data: d.toString(), stage: 'error', timestamp: new Date() });
                            });
                            pr.on('exit', function (d) {
                                var code = d.toString();
                                var displayCode = '';
                                if (code === '0') {
                                    displayCode = 'ERFOLG';
                                } else {
                                    displayCode = 'ABBRUCH';
                                }
                                addToQueue({ cat: cat, data: displayCode, stage: 'exit', timestamp: new Date() });
                                console.log('Exit', d.toString());
                                res(d);
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
}
function resetPi(req, res) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return executeCommandSpawn('/home/pi/master-prep/reset-and-reboot.sh', 'reset', true, false, { detached: true }).catch(errorHandler(res));

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
}
function index(req, res) {
    _index(req, res).catch(console.log);
}