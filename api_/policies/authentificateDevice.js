async function _check(req, res, next) {

  console.log('Requesting key');

  const deviceID = req.headers['deviceid'];
  const key = req.headers['devicekey'];
  const device = await Device.findOne({
    id: deviceID,
  });

  let message = '';

  // if (key !== device.key) {
  //   message += '\nFalse key';
  // }

  switch (false) {
    // case Boolean(key):
    //   message += '\nNo key supplied';
    case Boolean(device):
      message += '\nNo device found with id:' + deviceID;
    default:
      break;
  }

  if (message) {
    res.badRequest(message);
    await TransferLog.create({
      device: deviceID,
      type: 'CONFIG',
      succeeded: false,
      message,
      route: req.path,
      ip: req.ip,
      timestamp: new Date().toJSON(),
    });

    return;
  }

  req.device = device;
  next();
}

function check(req, res, next) {
  _check(req, res, next).catch((err) => {console.log(err); res.serverError()});
}

module.exports = check;
