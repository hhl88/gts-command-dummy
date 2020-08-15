export interface ICommands {
  switchMode;
  getValues;
  getTemperature;
  getFlow;
  getVolume;
  getPumpPower;
  getValves;
  getPump;
  getDigin;
  getPressure;

  setPumpSpeed;
  getFiltration;
  setZero;
  setPump;
  setValves;
  setValvePulse;

  bootSystem;
  haltSystem;

  resetAlarms;
  valuesToSD;
  resetCounter;
  saveServer;

  timerStart;
  timerStartKW;
  rueckspuelen;
  timerStop;

  fetchconfig;
  startPlant;
  timerStopKS;

  getDayValues;

  resetToInit;

  getAlerts;
  getSensorLevel;
  getMeasurements;
  setOperationReport;
  checkFunctions;
  intensivspuelen;
  startSpuelen;
  setPumpSpeeds;
  getStat;
}

enum Modes {
  GET,
  MANUAL,
  AUTOMATIC,
}


const enums: ICommands = {
  switchMode: 'switchMode',

  getTemperature: 'getTemperature',
  getFlow: 'getFlow',
  getVolume: 'getVolume',
  getPumpPower: 'getPumpPower',
  getValves: 'getValves',
  getPump: 'getPump',
  getDigin: 'getDigin',
  getPressure: 'getPressure',
  getValues: 'getValues',
  setZero: 'setZero',
  setPump: 'setPump',
  getFiltration: 'getFiltration',
  setPumpSpeed: 'setPumpSpeed',
  setValves: 'setValves',
  setValvePulse: 'setValvePulse',

  bootSystem: 'bootSystem',
  haltSystem: 'haltSystem',
  timerStop: 'timerStop',

  resetAlarms: 'resetAlarms',
  valuesToSD: 'valuesToSD',
  resetCounter: 'resetCounter',
  saveServer: 'saveServer',

  timerStart: 'timerStart',
  timerStartKW: 'timerStartKW',
  rueckspuelen: 'rueckspuelen',

  fetchconfig: 'fetchconfig',

  startPlant: 'startPlant',
  timerStopKS: 'timerStopKS',
  getDayValues: 'getDayValues',

  resetToInit: 'resetToInit',

  getAlerts: 'getAlerts',
  getSensorLevel: 'getSensorLevel',
  getMeasurements: 'getMeasurements',
  setOperationReport: 'setOperationReport',
  checkFunctions: 'checkFunctions',
  intensivspuelen: 'intensivspuelen',
  startSpuelen: 'startSpuelen',
  setPumpSpeeds: 'setPumpSpeeds',
  getStat: 'getStat'
};

// const MOCK_PREFIX = '/Users/honghaile/dev/silpion/gts/gts-command/global/scripts/';
const INTERFACE = 'PATH=$PATH:/usr/local/bin /usr/local/bin/interface.sh';

// const INTERFACE = '/Users/honghaile/dev/silpion/gts/gts-command/global/scripts/interface.sh';
const PREFIX = 'PATH=$PATH:/usr/local/bin /usr/local/bin/';
const sensors = ['1', '2', '3'];
const ventils = ['10000', '01000', '00100', '00010', '00001'];
const statusOnOff = ['ON', 'OFF'];
const pumpen = ['1', '2', 1, 2];

export class ServerApi implements ICommands {

  getDayValues() {
    const exec = `${INTERFACE} GET_DAY_VALUES`;
    return exec;
  }

  timerStop() {
    const exec = `${INTERFACE} SET_TIMER_STOP`;
    return exec;
  }

  timerStopKS() {
    const exec = `${INTERFACE} SET_TIMER_STOP_KS`;
    return exec;
  }

  timerStart() {
    const exec = `${INTERFACE} SET_TIMER_START`;
    return exec;
  }

  timerStartKW() {
    const exec = `${INTERFACE} SET_TIMER_START_KW`;
    return exec;
  }

  rueckspuelen() {
    const exec = `${INTERFACE} SET_RUECKSPUELEN`;
    return exec;
  }

  resetAlarms() {
    const exec = `${INTERFACE} SET_RESET_ALARMS`;
    return exec;
  }

  valuesToSD() {
    const exec = `${PREFIX}values.sh`;
    return exec;
  }

  resetCounter() {
    const exec = `${PREFIX}reset_counter.sh`;
    return exec;
  }

  saveServer() {
    const exec = `${PREFIX}transfer.sh`;
    return exec;
  }

  getValues(body) {
    const exec = `${INTERFACE} GET_ALL_VALUES`;
    return exec;
  }

  bootSystem() {
    const exec = `sudo reboot`;
    return exec;
  }

  haltSystem() {
    const exec = `sudo halt`;
    return exec;
  }

  getFiltration() {
    const exec = `${INTERFACE} GET_FILTRATION`;
    return exec;
  }

  switchMode(body) {
    if (['GET', 'AUTOMATIC', 'MANUAL'].indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }
    const com = body.command;

    let exec = '';
    if (com === 'GET') {
      exec = `${PREFIX}switch_mode.sh GET`;
    } else {
      exec = `${PREFIX}switch_mode.sh SET ${com}`;
    }
    return exec;
  }

  getTemperature(body) {
    if (sensors.indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }
    const sensor = body.command;

    const exec = `${INTERFACE} GET_TEMP${sensor}`;
    return exec;
  }

  getFlow(body) {
    if (sensors.indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }
    const sensor = body.command;

    const exec = `${INTERFACE} GET_FLOW${sensor}`;
    return exec;
  }

  getVolume(body) {
    if (sensors.indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }
    const sensor = body.command;

    const exec = `${INTERFACE} GET_VOLUME${sensor}`;
    return exec;
  }

  getPumpPower(body) {
    if (pumpen.indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }

    const pumpe = body.command;

    const exec = `${INTERFACE} GET_PUMP_POWER${pumpe}`;
    return exec;
  };

  getValves() {
    const exec = `${INTERFACE} GET_VALVES`;
    return exec;
  }

  getPump() {
    const exec = `${INTERFACE} GET_PUMP`;
    return exec;
  }

  getDigin() {
    const exec = `${INTERFACE} GET_DIGIN`;
    return exec;
  }

  getPressure() {
    const exec = `${INTERFACE} GET_PRESSURE`;
    return exec;
  }

  setZero(body) {
    if (sensors.indexOf(body.command) === -1) {
      throw 'No such command' + body.command;
    }
    const sensor = body.command;

    const exec = `${INTERFACE} SET_ZERO${sensor}`;
    return exec;
  }

  setPump(body) {
    console.log('setPump', body);
    if (statusOnOff.indexOf(body.command) === -1) {
      throw 'No such command ' + body.command;
    }
    const com = body.command;
    const exec = `${INTERFACE} SET_PUMP${com}`;
    return exec;
  }

  setValves(body) {
    console.log('setValves', body);
    if (statusOnOff.indexOf(body.command) === -1) {
      throw 'No such command ' + body.command;
    }

    const checkVar = body.ventil.split('');

    if (checkVar.length !== 6 || checkVar.filter(e => e !== '1' && e !== '0').length) {
      throw 'Erroneous input ' + body.ventil;
    }

    const com = body.command;
    const ventil = body.ventil;
    const exec = `${INTERFACE} SET_VALVES${com} ${ventil}`;
    return exec;
  }

  setPumpSpeed(body) {
    console.log('setPumpSpeed', body);
    if (pumpen.indexOf(body.pump) === -1) {
      throw 'No such pumpe ' + body.pump;
    }

    if (isNaN(parseInt(body.speed))) throw 'Drehzahl not a number';

    const exec = `${INTERFACE} SET_PUMPSPEED ${body.pump} ${body.speed}`;
    return exec;
  }


  setValvePulse(body) {
    const checkVar = body.ventil.split('');
    if (checkVar.filter(e => ['1', '2', '3', '4', '5'].indexOf(e) === -1).length) {
      throw 'Erroneous input ' + body.ventil;
    }

    if (isNaN(parseInt(body.duration))) throw 'Duration not a number';
    if (isNaN(parseInt(body.pause))) throw 'Pause not a number';
    if (isNaN(parseInt(body.repetitions))) throw 'Repetions not a number';

    const com = body.command;
    const ventil = body.ventil;

    const exec = `${INTERFACE} SET_VALVEPULSE${com} ${ventil} ${body.duration} ${body.pause} ${body.repetitions}`;
    return exec;
  }

  fetchconfig() {
    const exec = `sudo ${PREFIX}fetchconfig2.sh`;
    return exec;
  }

  startPlant() {
    const exec = `${INTERFACE} SET_FIRSTRUN`;
    return exec;
  }

  resetToInit() {
    const exec = `/home/pi/download-master-prep.sh || /home/pi/master-prep/reset-and-reboot.sh`;
    return exec;
  }

  getAlerts() {
    const exec = `${INTERFACE} GET_ALARM_ARDUINO \
    && ${INTERFACE} GET_ALARM_PUMP_MIN_FLOW \
    && ${INTERFACE} GET_ALARM_PUMP_MAX_FLOW \
    && ${INTERFACE} GET_ALARM_VALVE_OFF_MAX_FLOW
    `;
    return exec;
  }

  getSensorLevel() {
    const exec = `${PREFIX}usb_master "ql"`;
    return exec;
  }

  getMeasurements() {
    const exec = `${PREFIX}usb_master "qb"`;
    return exec;
  }

  setOperationReport(body) {
    if (statusOnOff.indexOf(body.command) === -1) {
      throw 'No such command ' + body.command;
    }
    const com = body.command;
    const exec = `${PREFIX}usb_master "b${com === "OFF" ? 0 : 1}"`;
    return exec;
  }

  checkFunctions() {
    console.log('checkFunctions1');
    const exec = `${PREFIX}check-functions.sh`;
    return exec;
  }

  intensivspuelen() {
    const exec = `${PREFIX}intensivspuelen.sh`;
    return exec;
  }

  startSpuelen() {
    const exec = `${PREFIX}spuelen_start.sh`;
    return exec;
  }

  setPumpSpeeds(body) {
    if (isNaN(parseInt(body.speed))) throw 'Drehzahl not a number';
    const exec = `sudo ${PREFIX}set_pwm2.sh ${body.speed}`;
    return exec;
  }

  getStat() {
    const exec = `${PREFIX}usb_master stat`;
    return exec
  }
}

export class Frontend implements ICommands {

  getDayValues() {
    const exec = {role: enums.getDayValues};
    return exec;
  }

  timerStopKS() {
    const exec = {role: enums.timerStopKS};
    return exec;
  }

  timerStop() {
    const exec = {role: enums.timerStop};
    return exec;
  }

  timerStart() {
    const exec = {role: enums.timerStart};
    return exec;
  }

  timerStartKW() {
    const exec = {role: enums.timerStartKW};
    return exec;
  }

  rueckspuelen() {
    const exec = {role: enums.rueckspuelen};
    return exec;
  }

  getValues() {
    const exec = {role: enums.getValues};
    return exec;
  }

  getFiltration() {
    const exec = {role: enums.getFiltration};
    return exec;
  }

  switchMode(com) {
    const exec = {command: com, role: enums.switchMode};
    return exec;
  }

  getTemperature(com) {
    const exec = {command: com, role: enums.getTemperature};
    return exec;
  }

  getFlow(com) {
    const exec = {command: com, role: enums.getFlow};
    return exec;
  };

  getVolume(com) {
    const exec = {command: com, role: enums.getVolume};
    return exec;
  }

  getPumpPower(com) {
    const exec = {command: com, role: enums.getPumpPower};
    return exec;
  }

  getValves() {
    const exec = {role: enums.getValves};
    return exec;
  };

  getPump() {
    const exec = {role: enums.getPump};
    return exec;
  }

  getDigin() {
    const exec = {role: enums.getDigin};
    return exec;
  }

  getPressure() {
    const exec = {role: enums.getPressure};
    return exec;
  }

  setZero(com) {
    const exec = {command: com, role: enums.setZero};
    return exec;
  }

  setPump(com) {
    const exec = {command: com, role: enums.setPump};
    return exec;
  }

  setValves(com, ventil) {
    const exec = {command: com, ventil, role: enums.setValves};
    return exec;
  }

  bootSystem() {
    const exec = {role: enums.bootSystem};
    return exec;
  }

  haltSystem() {
    const exec = {role: enums.haltSystem};
    return exec;
  }

  resetAlarms() {
    const exec = {role: enums.resetAlarms};
    return exec;
  }

  valuesToSD() {
    const exec = {role: enums.valuesToSD};
    return exec;
  }

  resetCounter() {
    const exec = {role: enums.resetCounter};
    return exec;
  }

  saveServer() {
    const exec = {role: enums.saveServer};
    return exec;
  }

  setPumpSpeed(com, pump, speed) {
    console.log('setPumpSpeed');
    const exec = {command: com, pump, speed, role: enums.setPumpSpeed};
    return exec;
  }

  setValvePulse(com, ventil, duration, pause, repetitions) {
    const exec = {command: com, ventil, duration, pause, repetitions, role: enums.setValvePulse};
    return exec;
  }

  fetchconfig() {
    const exec = {role: enums.fetchconfig};
    return exec;
  }

  startPlant() {
    const exec = {role: enums.startPlant};
    return exec;
  }

  resetToInit() {
    const exec = {role: enums.resetToInit};
    return exec;
  }

  getAlerts() {
    const exec = {role: enums.getAlerts};
    return exec;
  }

  getSensorLevel() {
    const exec = {role: enums.getSensorLevel};
    return exec;
  }

  getMeasurements() {
    const exec = {role: enums.getMeasurements};
    return exec;
  }

  setOperationReport(com) {
    const exec = {command: com, role: enums.setOperationReport};
    return exec;
  }

  checkFunctions() {
    const exec = {role: enums.checkFunctions};
    return exec;
  }

  intensivspuelen() {
    const exec = {role: enums.intensivspuelen};
    return exec;
  }

  startSpuelen() {
    const exec = {role: enums.startSpuelen};
    return exec;
  }

  setPumpSpeeds(com, speed) {
    const exec = {command: com, speed, role: enums.setPumpSpeeds};
    return exec;
  }

  getStat() {
    const exec = {role: enums.getStat};
    return exec;
  }

}
