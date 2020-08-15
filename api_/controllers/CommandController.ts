/**
 * @Author: Igor Fischer <igor>
 * @Date:   2016-03-17T17:20:25+01:00
 * @Last modified by:   igor
 * @Last modified time: 2016-04-09T11:09:12+02:00
 */

declare var require, process;


function errorHandler(res) {
  console.log('errorHandler 1');
  return (err) => {
    res.serverError(500);
    console.log('errorHandler 2', err);
  };
}

function getMinutesBetweenDates(startDate, endDate) {
  const diff = endDate.getTime() - startDate.getTime();
  return (diff / 60000);
}

function getSecondsBetweenDates(startDate, endDate) {
  const diff = endDate.getTime() - startDate.getTime();
  return (diff / 6000);
}


import * as fs from 'fs-extra';

const config = require('../../config');
const commandApi = require('../commandApi');
const serverResponder = new commandApi.ServerApi();
const chproc = require('child_process');
const isPi = Boolean(process.env.APPONPI) || true;
// const isPi = false;

console.log('Start on raspi', isPi);

let queue = {executing: false, time: null};

function retry(fn) {
  console.log('Check if nothing is executing');

  if (queue.executing) {
    const diff = getMinutesBetweenDates(queue.time, new Date());
    if (diff >= 2) {
      fn();
    } else {
      console.log('Negative - waiting');
      setTimeout(retry.bind({}, fn), 1000);
    }
  } else {
    queue = {
      executing: true,
      time: new Date(),
    };
    console.log('Positive - go, go');
    fn();
  }
}

async function _index(req, res) {
  const command = req.query;
  console.log('_index_', command);

  if (!command && command.role) {
    res.badRequest('No command send.');
  }

  if (!(command.role in serverResponder)) {
    res.badRequest('No such command.');
  }
  const exec = serverResponder[command.role](command);


  let toExec = exec;

  if (!isPi) {
    // toExec = `ssh -o StrictHostKeyChecking=no pi@185.48.118.115 -p ${config.remotePiPort} "${exec}"`;
    toExec = `ssh -o StrictHostKeyChecking=no pi@172.27.4.63 "${exec}"`;

  }

  console.log('Executing:', toExec);

  const start = new Date();
  const fn = () => chproc.exec(toExec, (err, out, code) => {
    console.log(err, out, code);
    const end = new Date();
    const mes = {
      out,
      code,
      err,
      exec,
      duration: getSecondsBetweenDates(start, end),
      requestBody: command,
    };

    res.json(mes);
    queue = {
      executing: false,
      time: null,
    };
  });

  retry(fn);
}

function addToQueue(obj) {
  console.log('DATA', obj.data);

}

const spawn = require('child_process').spawn;

export async function executeCommandSpawn(com: string, cat: string, isScript: boolean = false, isSudo: boolean = false, opts = {}) {
  return new Promise((res, rej) => {
    let toExec = isSudo ? `sudo ${com.trim()}` : com.trim();
    let pr;
    let stats;
    try {
      console.log('executeCommandSpawn')
      console.log('com', com.trim())
      console.log('cat', cat)
      console.log('isScript', isScript)
      console.log('isSudo', isSudo)

      // check if file exists, because spawn break whole app when not
      if (isScript) {
        stats = fs.lstatSync(com.trim());
      }
      if (!isPi) {
        // toExec = `ssh -o StrictHostKeyChecking=no pi@185.48.118.115 -p ${config.remotePiPort} "${com.trim()}"`;
        toExec = `ssh -o StrictHostKeyChecking=no pi@172.27.4.63 -p ${config.remotePiPort} "${com.trim()}"`;
      }
      console.log('SPAWN:', toExec);
      pr = spawn(toExec, opts);
    } catch (e) {
      console.log('ERROR:', e);
      rej(e);
      return;
    }

    pr.stdout.on('data', (d) => addToQueue({cat, data: d.toString(), stage: 'data', timestamp: new Date()}));
    pr.stderr.on('data', (d) => addToQueue({cat, data: d.toString(), stage: 'error', timestamp: new Date()}));
    pr.on('exit', (d) => {
      const code = d.toString();
      let displayCode = '';
      if (code === '0') {
        displayCode = 'ERFOLG';
      } else {
        displayCode = 'ABBRUCH';
      }
      addToQueue({cat, data: displayCode, stage: 'exit', timestamp: new Date()})
      console.log('Exit', d.toString());
      res(d);
    });
  })
}

export async function resetPi(req, res) {
  // can fail
  // await executeCommandSpawn('/home/pi/download-master-prep.sh', 'reset').catch(console.log);

  // if fails then send error to cleint
  await executeCommandSpawn('/home/pi/master-prep/reset-and-reboot.sh', 'reset', true, false, {detached: true}).catch(errorHandler(res));
}


export function index(req, res) {
  _index(req, res).catch(console.log);
}
