/* eslint-disable */

function temperatureWarning({
  sensor, data,
}) {

  // filter data which should be warned about
  var temperature = data.filter((item) => {
    var temp = item.temp;
    var date = item.date;
    var {
      temperatur: {
        min, max,
      },
      beschreibung,
    } = rightPeriod({
      sensor, date,
    });

    // check if temperature is over maximum or under minimum
    var [overMax, overMin] = [temp > max, temp < min];
    if (overMax) {
      var delta = (temp - overMax).toFixed(1);
      item.tempwarning = `${sensor.name}, ${item.date}, Maximalwert überschritten, ${beschreibung}, ${temp}, ${max}, ${delta}\n`;
    }

    if (overMin) {
      var delta = (min - temp).toFixed(1);
      item.tempwarning = `${sensor.name}, ${item.date}, Minimalwert überschritten, ${beschreibung}, ${temp}, ${min}, ${delta}\n`;
    }

    item.parsedOn = globalConfig.today;

    return item.tempwarning;
  });

  // csv headers
  var temperatureHeader = '\nName, Datum, Warnung, Zeitraum, Wert, Grenzwert, Delta\n';

  return {
    temperature, temperatureHeader,
  };
}

function signalWarning({
  sensor, data,
}) {
  var signal = data.filter(item => {

    // if data signal is weaker then the minimum set (means greater -> higher minus values are better signal)
    var signalWarning = item.sig > sensor.signalstaerkeMin;
    item.parsedOn = globalConfig.today;

    if (signalWarning)
      item.signalwarning = `${sensor.name}, geringe Signalstärke, ${item.date}, ${item.sig}, ${sensor.signalstaerkeMin}\n`;
    return item.signalwarning;
  });

  var signalHeader = '\nName, Warnung, Datum, Wert, Grenzwert\n';
  return {
    signal, signalHeader,
  };
}

function report({
  sensor, data,
}) {
  var averageSig = data.reduce((a, e) => a + e.sig, 0) / data.length;

  // thats the two Periods we need for summary report
  var {
    Normal, Nachtabsenkung,
  } = _.groupBy(data, item => {
    var desc = rightPeriod({
      sensor, date: item.date,
    }).beschreibung;
    return desc;
  });

  var normalMax = Normal ? _.max(Normal, e => e.temp) : 'NA';
  var normalMin = Normal ? _.min(Normal, e => e.temp) : 'NA';

  var nightMax = Nachtabsenkung ? _.max(Nachtabsenkung, e => e.temp).temp : 'NA';
  var nightMin = Nachtabsenkung ? _.min(Nachtabsenkung, e => e.temp).temp : 'NA';

  var datum = data[0] ? moment(data[0].date).format('YYYY-MM-DD') : 'NA';

  // thats the object which goes into db
  var vals = [globalConfig.today, data[0].reportName, sensor.anlage, sensor.nummer, sensor.name, datum, normalMax, normalMin, nightMax, nightMin, Math.round(averageSig)];
  var order = ['wannVerarbeitet', 'reportName', 'anlage', 'sensornummer', 'sensorname', 'datum', 'normalMax', 'normalMin', 'nightMax', 'nightMin', 'Durchschnittssignal'];

  // align two arrays
  var reports = [_.object(order, vals)];
  var reportHeader = '';
  return {
    reports,
  };
}

function analyseSensor(args) {

  // parse the data for each end parameter
  var {
    reportHeader, reports,
  } = report(args);
  var {
    signalHeader, signal,
  } = signalWarning(args);
  var {
    temperatureHeader, temperature,
  } = temperatureWarning(args);
  return {
    reports, signal, temperature, sensor: args.sensor, headers: {
      temperatureHeader, signalHeader,
    },
  };
}

async function insert(reports) {

  // if its an array then it contains data for single sensors, so insert each sensor separately
  const name = reports.reports[0].reportName;
  if (Array.isArray(reports)) {
    return Promise.all(reports.map(sensorreport => insert({
      reports: sensorreport,
      name,
      anlageId,
    })));
  } else {
    try {

      // first cleanup the data; in case the script is called twice on the report
      // we do not want to have duplicate data
      // cleanup makes sense if the user e.g. supplied a new, maybe, updated file
      Promise.all([
        TempwatchDayreport.remove({
          reportName: name,
        }),
        TempwatchSignal.remove({
          reportName: name,
        }),
        TempwatchWarning.remove({
          reportName: name,
        }),
      ]);

      // insert data of each report async
      var res = Promise.all([
        _.chunk(reports.reports).forEach(TempwatchDayreport.insert),
        _.chunk(reports.signal).forEach(TempwatchSignal.insert),
        _.chunk(reports.temperature).forEach(TempwatchWarning.insert),
      ]);
      return res;
    } catch (e) {
      console.log('e', e, 'e');
    }
  }
}

async function analyseSheet(sheet, config, device) {

  var grouped = _.groupBy(sheet, (item) => item.number);

  console.log('analyseSheet:', device.directoryId, '#lines', sheet, 'with:', config);

  // check if for every sensor in the config there is data in the report file and has minimun of data
  // macro check

  // read config file for anlage
  var complete = config.sensoren.map(item => {
    item.anlage = device.id;
    item.anlageName = device.directoryId;
    return item;
  });

  var macroErrors = '';
  var minimumOfData = config.mininumOfData || 30;
  for (let sensor of config.sensoren) {
    let k = sensor.nummer;
    if (!(k in grouped)) {
      let err = `Sensor with nummer: ${sensor.nummer} has no data in report file!\n`;

      // console.log(err);
      macroErrors += err;
      continue;
    }

    if (grouped[k].length < minimumOfData) {
      let err = `Sensor with nummer: ${sensor.nummer} has less data then ${minimumOfData} entries, only: ${grouped[k].length}!\n`;

      // console.log(err);
      macroErrors += err;
    }
  }

  // analyse data for each sensor in the config
  var reports = complete.map((sensor) => analyseSensor({
    name, sensor, data: grouped[sensor.nummer] || [],
  }));
  console.log('analyseSheet-end:', reports);

  return reports;
}
