async function _check(req, res, next) {

  console.log('Requesting key');

  const deviceID = req.device.id;
  const name = req.headers.reportname;
  const key = req.headers.devicekey;
  const body = Object.keys(req.body)[0];

  let message = '';
  switch (false) {
    case Boolean(name):
      message += '\nNo reportname supplied';
    case Boolean(body):
      message += '\nNo report body found';
    default:
      break;
  }

  if (message) {
    res.badRequest(message);
    await TransferLog.create({
      device: deviceID,
      type: 'REPORT',
      succeeded: false,
      message,
      ip: req.ip,
      transferDate: new Date().toJSON(),
    });

    return;
  }

  console.log('Everything ok with report setup: proceed', req.body);

  req.dataSheet = body;
  req.reportName = name;

  next();
}

function check(req, res, next) {
  _check(req, res, next).catch((err) => {console.log(err); res.serverError()});
}

module.exports = check;
