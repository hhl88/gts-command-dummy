'use strict';

var _check = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var deviceID, key, device, message;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            console.log('Requesting key');

            deviceID = req.headers['deviceid'];
            key = req.headers['devicekey'];
            _context.next = 5;
            return Device.findOne({
              id: deviceID
            });

          case 5:
            device = _context.sent;
            message = '';

            // if (key !== device.key) {
            //   message += '\nFalse key';
            // }

            _context.t0 = false;
            _context.next = _context.t0 === Boolean(device) ? 10 : 11;
            break;

          case 10:
            message += '\nNo device found with id:' + deviceID;

          case 11:
            return _context.abrupt('break', 12);

          case 12:
            if (!message) {
              _context.next = 17;
              break;
            }

            res.badRequest(message);
            _context.next = 16;
            return TransferLog.create({
              device: deviceID,
              type: 'CONFIG',
              succeeded: false,
              message: message,
              route: req.path,
              ip: req.ip,
              timestamp: new Date().toJSON()
            });

          case 16:
            return _context.abrupt('return');

          case 17:

            req.device = device;
            next();

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function _check(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function check(req, res, next) {
  _check(req, res, next).catch(function (err) {
    console.log(err);res.serverError();
  });
}

module.exports = check;