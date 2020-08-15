'use strict';

var insert = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reports) {
    var name, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // if its an array then it contains data for single sensors, so insert each sensor separately
            name = reports.reports[0].reportName;

            if (!Array.isArray(reports)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', Promise.all(reports.map(function (sensorreport) {
              return insert({
                reports: sensorreport,
                name: name,
                anlageId: anlageId
              });
            })));

          case 5:
            _context.prev = 5;


            // first cleanup the data; in case the script is called twice on the report
            // we do not want to have duplicate data
            // cleanup makes sense if the user e.g. supplied a new, maybe, updated file
            Promise.all([TempwatchDayreport.remove({
              reportName: name
            }), TempwatchSignal.remove({
              reportName: name
            }), TempwatchWarning.remove({
              reportName: name
            })]);

            // insert data of each report async
            res = Promise.all([_.chunk(reports.reports).forEach(TempwatchDayreport.insert), _.chunk(reports.signal).forEach(TempwatchSignal.insert), _.chunk(reports.temperature).forEach(TempwatchWarning.insert)]);
            return _context.abrupt('return', res);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](5);

            console.log('e', _context.t0, 'e');

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 11]]);
  }));

  return function insert(_x) {
    return _ref4.apply(this, arguments);
  };
}();

var analyseSheet = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sheet, config, device) {
    var grouped, complete, macroErrors, minimumOfData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sensor, k, err, _err, reports;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            grouped = _.groupBy(sheet, function (item) {
              return item.number;
            });


            console.log('analyseSheet:', device.directoryId, '#lines', sheet, 'with:', config);

            // check if for every sensor in the config there is data in the report file and has minimun of data
            // macro check

            // read config file for anlage
            complete = config.sensoren.map(function (item) {
              item.anlage = device.id;
              item.anlageName = device.directoryId;
              return item;
            });
            macroErrors = '';
            minimumOfData = config.mininumOfData || 30;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 8;
            _iterator = config.sensoren[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 21;
              break;
            }

            sensor = _step.value;
            k = sensor.nummer;

            if (k in grouped) {
              _context2.next = 17;
              break;
            }

            err = 'Sensor with nummer: ' + sensor.nummer + ' has no data in report file!\n';

            // console.log(err);

            macroErrors += err;
            return _context2.abrupt('continue', 18);

          case 17:

            if (grouped[k].length < minimumOfData) {
              _err = 'Sensor with nummer: ' + sensor.nummer + ' has less data then ' + minimumOfData + ' entries, only: ' + grouped[k].length + '!\n';

              // console.log(err);

              macroErrors += _err;
            }

          case 18:
            _iteratorNormalCompletion = true;
            _context2.next = 10;
            break;

          case 21:
            _context2.next = 27;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2['catch'](8);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 27:
            _context2.prev = 27;
            _context2.prev = 28;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 30:
            _context2.prev = 30;

            if (!_didIteratorError) {
              _context2.next = 33;
              break;
            }

            throw _iteratorError;

          case 33:
            return _context2.finish(30);

          case 34:
            return _context2.finish(27);

          case 35:

            // analyse data for each sensor in the config
            reports = complete.map(function (sensor) {
              return analyseSensor({
                name: name, sensor: sensor, data: grouped[sensor.nummer] || []
              });
            });

            console.log('analyseSheet-end:', reports);

            return _context2.abrupt('return', reports);

          case 38:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[8, 23, 27, 35], [28,, 30, 34]]);
  }));

  return function analyseSheet(_x2, _x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable */

function temperatureWarning(_ref) {
  var sensor = _ref.sensor,
      data = _ref.data;


  // filter data which should be warned about
  var temperature = data.filter(function (item) {
    var temp = item.temp;
    var date = item.date;

    var _rightPeriod = rightPeriod({
      sensor: sensor, date: date
    }),
        _rightPeriod$temperat = _rightPeriod.temperatur,
        min = _rightPeriod$temperat.min,
        max = _rightPeriod$temperat.max,
        beschreibung = _rightPeriod.beschreibung;

    // check if temperature is over maximum or under minimum


    var overMax = temp > max,
        overMin = temp < min;

    if (overMax) {
      var delta = (temp - overMax).toFixed(1);
      item.tempwarning = sensor.name + ', ' + item.date + ', Maximalwert \xFCberschritten, ' + beschreibung + ', ' + temp + ', ' + max + ', ' + delta + '\n';
    }

    if (overMin) {
      var delta = (min - temp).toFixed(1);
      item.tempwarning = sensor.name + ', ' + item.date + ', Minimalwert \xFCberschritten, ' + beschreibung + ', ' + temp + ', ' + min + ', ' + delta + '\n';
    }

    item.parsedOn = globalConfig.today;

    return item.tempwarning;
  });

  // csv headers
  var temperatureHeader = '\nName, Datum, Warnung, Zeitraum, Wert, Grenzwert, Delta\n';

  return {
    temperature: temperature, temperatureHeader: temperatureHeader
  };
}

function signalWarning(_ref2) {
  var sensor = _ref2.sensor,
      data = _ref2.data;

  var signal = data.filter(function (item) {

    // if data signal is weaker then the minimum set (means greater -> higher minus values are better signal)
    var signalWarning = item.sig > sensor.signalstaerkeMin;
    item.parsedOn = globalConfig.today;

    if (signalWarning) item.signalwarning = sensor.name + ', geringe Signalst\xE4rke, ' + item.date + ', ' + item.sig + ', ' + sensor.signalstaerkeMin + '\n';
    return item.signalwarning;
  });

  var signalHeader = '\nName, Warnung, Datum, Wert, Grenzwert\n';
  return {
    signal: signal, signalHeader: signalHeader
  };
}

function report(_ref3) {
  var sensor = _ref3.sensor,
      data = _ref3.data;

  var averageSig = data.reduce(function (a, e) {
    return a + e.sig;
  }, 0) / data.length;

  // thats the two Periods we need for summary report

  var _$groupBy = _.groupBy(data, function (item) {
    var desc = rightPeriod({
      sensor: sensor, date: item.date
    }).beschreibung;
    return desc;
  }),
      Normal = _$groupBy.Normal,
      Nachtabsenkung = _$groupBy.Nachtabsenkung;

  var normalMax = Normal ? _.max(Normal, function (e) {
    return e.temp;
  }) : 'NA';
  var normalMin = Normal ? _.min(Normal, function (e) {
    return e.temp;
  }) : 'NA';

  var nightMax = Nachtabsenkung ? _.max(Nachtabsenkung, function (e) {
    return e.temp;
  }).temp : 'NA';
  var nightMin = Nachtabsenkung ? _.min(Nachtabsenkung, function (e) {
    return e.temp;
  }).temp : 'NA';

  var datum = data[0] ? moment(data[0].date).format('YYYY-MM-DD') : 'NA';

  // thats the object which goes into db
  var vals = [globalConfig.today, data[0].reportName, sensor.anlage, sensor.nummer, sensor.name, datum, normalMax, normalMin, nightMax, nightMin, Math.round(averageSig)];
  var order = ['wannVerarbeitet', 'reportName', 'anlage', 'sensornummer', 'sensorname', 'datum', 'normalMax', 'normalMin', 'nightMax', 'nightMin', 'Durchschnittssignal'];

  // align two arrays
  var reports = [_.object(order, vals)];
  var reportHeader = '';
  return {
    reports: reports
  };
}

function analyseSensor(args) {

  // parse the data for each end parameter
  var _report = report(args),
      reportHeader = _report.reportHeader,
      reports = _report.reports;

  var _signalWarning = signalWarning(args),
      signalHeader = _signalWarning.signalHeader,
      signal = _signalWarning.signal;

  var _temperatureWarning = temperatureWarning(args),
      temperatureHeader = _temperatureWarning.temperatureHeader,
      temperature = _temperatureWarning.temperature;

  return {
    reports: reports, signal: signal, temperature: temperature, sensor: args.sensor, headers: {
      temperatureHeader: temperatureHeader, signalHeader: signalHeader
    }
  };
}