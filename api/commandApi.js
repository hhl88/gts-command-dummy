"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Modes;
(function (Modes) {
    Modes[Modes["GET"] = 0] = "GET";
    Modes[Modes["MANUAL"] = 1] = "MANUAL";
    Modes[Modes["AUTOMATIC"] = 2] = "AUTOMATIC";
})(Modes || (Modes = {}));
var enums = {
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
var INTERFACE = 'PATH=$PATH:/usr/local/bin /usr/local/bin/interface.sh';
// const INTERFACE = '/Users/honghaile/dev/silpion/gts/gts-command/global/scripts/interface.sh';
var PREFIX = 'PATH=$PATH:/usr/local/bin /usr/local/bin/';
var sensors = ['1', '2', '3'];
var ventils = ['10000', '01000', '00100', '00010', '00001'];
var statusOnOff = ['ON', 'OFF'];
var pumpen = ['1', '2', 1, 2];

var ServerApi = exports.ServerApi = function () {
    function ServerApi() {
        _classCallCheck(this, ServerApi);
    }

    _createClass(ServerApi, [{
        key: "getDayValues",
        value: function getDayValues() {
            var exec = INTERFACE + " GET_DAY_VALUES";
            return exec;
        }
    }, {
        key: "timerStop",
        value: function timerStop() {
            var exec = INTERFACE + " SET_TIMER_STOP";
            return exec;
        }
    }, {
        key: "timerStopKS",
        value: function timerStopKS() {
            var exec = INTERFACE + " SET_TIMER_STOP_KS";
            return exec;
        }
    }, {
        key: "timerStart",
        value: function timerStart() {
            var exec = INTERFACE + " SET_TIMER_START";
            return exec;
        }
    }, {
        key: "timerStartKW",
        value: function timerStartKW() {
            var exec = INTERFACE + " SET_TIMER_START_KW";
            return exec;
        }
    }, {
        key: "rueckspuelen",
        value: function rueckspuelen() {
            var exec = INTERFACE + " SET_RUECKSPUELEN";
            return exec;
        }
    }, {
        key: "resetAlarms",
        value: function resetAlarms() {
            var exec = INTERFACE + " SET_RESET_ALARMS";
            return exec;
        }
    }, {
        key: "valuesToSD",
        value: function valuesToSD() {
            var exec = PREFIX + "values.sh";
            return exec;
        }
    }, {
        key: "resetCounter",
        value: function resetCounter() {
            var exec = PREFIX + "reset_counter.sh";
            return exec;
        }
    }, {
        key: "saveServer",
        value: function saveServer() {
            var exec = PREFIX + "transfer.sh";
            return exec;
        }
    }, {
        key: "getValues",
        value: function getValues(body) {
            var exec = INTERFACE + " GET_ALL_VALUES";
            return exec;
        }
    }, {
        key: "bootSystem",
        value: function bootSystem() {
            var exec = "sudo reboot";
            return exec;
        }
    }, {
        key: "haltSystem",
        value: function haltSystem() {
            var exec = "sudo halt";
            return exec;
        }
    }, {
        key: "getFiltration",
        value: function getFiltration() {
            var exec = INTERFACE + " GET_FILTRATION";
            return exec;
        }
    }, {
        key: "switchMode",
        value: function switchMode(body) {
            if (['GET', 'AUTOMATIC', 'MANUAL'].indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var com = body.command;
            var exec = '';
            if (com === 'GET') {
                exec = PREFIX + "switch_mode.sh GET";
            } else {
                exec = PREFIX + "switch_mode.sh SET " + com;
            }
            return exec;
        }
    }, {
        key: "getTemperature",
        value: function getTemperature(body) {
            if (sensors.indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var sensor = body.command;
            var exec = INTERFACE + " GET_TEMP" + sensor;
            return exec;
        }
    }, {
        key: "getFlow",
        value: function getFlow(body) {
            if (sensors.indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var sensor = body.command;
            var exec = INTERFACE + " GET_FLOW" + sensor;
            return exec;
        }
    }, {
        key: "getVolume",
        value: function getVolume(body) {
            if (sensors.indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var sensor = body.command;
            var exec = INTERFACE + " GET_VOLUME" + sensor;
            return exec;
        }
    }, {
        key: "getPumpPower",
        value: function getPumpPower(body) {
            if (pumpen.indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var pumpe = body.command;
            var exec = INTERFACE + " GET_PUMP_POWER" + pumpe;
            return exec;
        }
    }, {
        key: "getValves",
        value: function getValves() {
            var exec = INTERFACE + " GET_VALVES";
            return exec;
        }
    }, {
        key: "getPump",
        value: function getPump() {
            var exec = INTERFACE + " GET_PUMP";
            return exec;
        }
    }, {
        key: "getDigin",
        value: function getDigin() {
            var exec = INTERFACE + " GET_DIGIN";
            return exec;
        }
    }, {
        key: "getPressure",
        value: function getPressure() {
            var exec = INTERFACE + " GET_PRESSURE";
            return exec;
        }
    }, {
        key: "setZero",
        value: function setZero(body) {
            if (sensors.indexOf(body.command) === -1) {
                throw 'No such command' + body.command;
            }
            var sensor = body.command;
            var exec = INTERFACE + " SET_ZERO" + sensor;
            return exec;
        }
    }, {
        key: "setPump",
        value: function setPump(body) {
            console.log('setPump', body);
            if (statusOnOff.indexOf(body.command) === -1) {
                throw 'No such command ' + body.command;
            }
            var com = body.command;
            var exec = INTERFACE + " SET_PUMP" + com;
            return exec;
        }
    }, {
        key: "setValves",
        value: function setValves(body) {
            console.log('setValves', body);
            if (statusOnOff.indexOf(body.command) === -1) {
                throw 'No such command ' + body.command;
            }
            var checkVar = body.ventil.split('');
            if (checkVar.length !== 6 || checkVar.filter(function (e) {
                return e !== '1' && e !== '0';
            }).length) {
                throw 'Erroneous input ' + body.ventil;
            }
            var com = body.command;
            var ventil = body.ventil;
            var exec = INTERFACE + " SET_VALVES" + com + " " + ventil;
            return exec;
        }
    }, {
        key: "setPumpSpeed",
        value: function setPumpSpeed(body) {
            console.log('setPumpSpeed', body);
            if (pumpen.indexOf(body.pump) === -1) {
                throw 'No such pumpe ' + body.pump;
            }
            if (isNaN(parseInt(body.speed))) throw 'Drehzahl not a number';
            var exec = INTERFACE + " SET_PUMPSPEED " + body.pump + " " + body.speed;
            return exec;
        }
    }, {
        key: "setValvePulse",
        value: function setValvePulse(body) {
            var checkVar = body.ventil.split('');
            if (checkVar.filter(function (e) {
                return ['1', '2', '3', '4', '5'].indexOf(e) === -1;
            }).length) {
                throw 'Erroneous input ' + body.ventil;
            }
            if (isNaN(parseInt(body.duration))) throw 'Duration not a number';
            if (isNaN(parseInt(body.pause))) throw 'Pause not a number';
            if (isNaN(parseInt(body.repetitions))) throw 'Repetions not a number';
            var com = body.command;
            var ventil = body.ventil;
            var exec = INTERFACE + " SET_VALVEPULSE" + com + " " + ventil + " " + body.duration + " " + body.pause + " " + body.repetitions;
            return exec;
        }
    }, {
        key: "fetchconfig",
        value: function fetchconfig() {
            var exec = "sudo " + PREFIX + "fetchconfig2.sh";
            return exec;
        }
    }, {
        key: "startPlant",
        value: function startPlant() {
            var exec = INTERFACE + " SET_FIRSTRUN";
            return exec;
        }
    }, {
        key: "resetToInit",
        value: function resetToInit() {
            var exec = "/home/pi/download-master-prep.sh || /home/pi/master-prep/reset-and-reboot.sh";
            return exec;
        }
    }, {
        key: "getAlerts",
        value: function getAlerts() {
            var exec = INTERFACE + " GET_ALARM_ARDUINO     && " + INTERFACE + " GET_ALARM_PUMP_MIN_FLOW     && " + INTERFACE + " GET_ALARM_PUMP_MAX_FLOW     && " + INTERFACE + " GET_ALARM_VALVE_OFF_MAX_FLOW\n    ";
            return exec;
        }
    }, {
        key: "getSensorLevel",
        value: function getSensorLevel() {
            var exec = PREFIX + "usb_master \"ql\"";
            return exec;
        }
    }, {
        key: "getMeasurements",
        value: function getMeasurements() {
            var exec = PREFIX + "usb_master \"qb\"";
            return exec;
        }
    }, {
        key: "setOperationReport",
        value: function setOperationReport(body) {
            if (statusOnOff.indexOf(body.command) === -1) {
                throw 'No such command ' + body.command;
            }
            var com = body.command;
            var exec = PREFIX + "usb_master \"b" + (com === "OFF" ? 0 : 1) + "\"";
            return exec;
        }
    }, {
        key: "checkFunctions",
        value: function checkFunctions() {
            console.log('checkFunctions1');
            var exec = PREFIX + "check-functions.sh";
            return exec;
        }
    }, {
        key: "intensivspuelen",
        value: function intensivspuelen() {
            var exec = PREFIX + "intensivspuelen.sh";
            return exec;
        }
    }, {
        key: "startSpuelen",
        value: function startSpuelen() {
            var exec = PREFIX + "spuelen_start.sh";
            return exec;
        }
    }, {
        key: "setPumpSpeeds",
        value: function setPumpSpeeds(body) {
            if (isNaN(parseInt(body.speed))) throw 'Drehzahl not a number';
            var exec = "sudo " + PREFIX + "set_pwm2.sh " + body.speed;
            return exec;
        }
    }, {
        key: "getStat",
        value: function getStat() {
            var exec = PREFIX + "usb_master stat";
            return exec;
        }
    }]);

    return ServerApi;
}();

var Frontend = exports.Frontend = function () {
    function Frontend() {
        _classCallCheck(this, Frontend);
    }

    _createClass(Frontend, [{
        key: "getDayValues",
        value: function getDayValues() {
            var exec = { role: enums.getDayValues };
            return exec;
        }
    }, {
        key: "timerStopKS",
        value: function timerStopKS() {
            var exec = { role: enums.timerStopKS };
            return exec;
        }
    }, {
        key: "timerStop",
        value: function timerStop() {
            var exec = { role: enums.timerStop };
            return exec;
        }
    }, {
        key: "timerStart",
        value: function timerStart() {
            var exec = { role: enums.timerStart };
            return exec;
        }
    }, {
        key: "timerStartKW",
        value: function timerStartKW() {
            var exec = { role: enums.timerStartKW };
            return exec;
        }
    }, {
        key: "rueckspuelen",
        value: function rueckspuelen() {
            var exec = { role: enums.rueckspuelen };
            return exec;
        }
    }, {
        key: "getValues",
        value: function getValues() {
            var exec = { role: enums.getValues };
            return exec;
        }
    }, {
        key: "getFiltration",
        value: function getFiltration() {
            var exec = { role: enums.getFiltration };
            return exec;
        }
    }, {
        key: "switchMode",
        value: function switchMode(com) {
            var exec = { command: com, role: enums.switchMode };
            return exec;
        }
    }, {
        key: "getTemperature",
        value: function getTemperature(com) {
            var exec = { command: com, role: enums.getTemperature };
            return exec;
        }
    }, {
        key: "getFlow",
        value: function getFlow(com) {
            var exec = { command: com, role: enums.getFlow };
            return exec;
        }
    }, {
        key: "getVolume",
        value: function getVolume(com) {
            var exec = { command: com, role: enums.getVolume };
            return exec;
        }
    }, {
        key: "getPumpPower",
        value: function getPumpPower(com) {
            var exec = { command: com, role: enums.getPumpPower };
            return exec;
        }
    }, {
        key: "getValves",
        value: function getValves() {
            var exec = { role: enums.getValves };
            return exec;
        }
    }, {
        key: "getPump",
        value: function getPump() {
            var exec = { role: enums.getPump };
            return exec;
        }
    }, {
        key: "getDigin",
        value: function getDigin() {
            var exec = { role: enums.getDigin };
            return exec;
        }
    }, {
        key: "getPressure",
        value: function getPressure() {
            var exec = { role: enums.getPressure };
            return exec;
        }
    }, {
        key: "setZero",
        value: function setZero(com) {
            var exec = { command: com, role: enums.setZero };
            return exec;
        }
    }, {
        key: "setPump",
        value: function setPump(com) {
            var exec = { command: com, role: enums.setPump };
            return exec;
        }
    }, {
        key: "setValves",
        value: function setValves(com, ventil) {
            var exec = { command: com, ventil: ventil, role: enums.setValves };
            return exec;
        }
    }, {
        key: "bootSystem",
        value: function bootSystem() {
            var exec = { role: enums.bootSystem };
            return exec;
        }
    }, {
        key: "haltSystem",
        value: function haltSystem() {
            var exec = { role: enums.haltSystem };
            return exec;
        }
    }, {
        key: "resetAlarms",
        value: function resetAlarms() {
            var exec = { role: enums.resetAlarms };
            return exec;
        }
    }, {
        key: "valuesToSD",
        value: function valuesToSD() {
            var exec = { role: enums.valuesToSD };
            return exec;
        }
    }, {
        key: "resetCounter",
        value: function resetCounter() {
            var exec = { role: enums.resetCounter };
            return exec;
        }
    }, {
        key: "saveServer",
        value: function saveServer() {
            var exec = { role: enums.saveServer };
            return exec;
        }
    }, {
        key: "setPumpSpeed",
        value: function setPumpSpeed(com, pump, speed) {
            console.log('setPumpSpeed');
            var exec = { command: com, pump: pump, speed: speed, role: enums.setPumpSpeed };
            return exec;
        }
    }, {
        key: "setValvePulse",
        value: function setValvePulse(com, ventil, duration, pause, repetitions) {
            var exec = { command: com, ventil: ventil, duration: duration, pause: pause, repetitions: repetitions, role: enums.setValvePulse };
            return exec;
        }
    }, {
        key: "fetchconfig",
        value: function fetchconfig() {
            var exec = { role: enums.fetchconfig };
            return exec;
        }
    }, {
        key: "startPlant",
        value: function startPlant() {
            var exec = { role: enums.startPlant };
            return exec;
        }
    }, {
        key: "resetToInit",
        value: function resetToInit() {
            var exec = { role: enums.resetToInit };
            return exec;
        }
    }, {
        key: "getAlerts",
        value: function getAlerts() {
            var exec = { role: enums.getAlerts };
            return exec;
        }
    }, {
        key: "getSensorLevel",
        value: function getSensorLevel() {
            var exec = { role: enums.getSensorLevel };
            return exec;
        }
    }, {
        key: "getMeasurements",
        value: function getMeasurements() {
            var exec = { role: enums.getMeasurements };
            return exec;
        }
    }, {
        key: "setOperationReport",
        value: function setOperationReport(com) {
            var exec = { command: com, role: enums.setOperationReport };
            return exec;
        }
    }, {
        key: "checkFunctions",
        value: function checkFunctions() {
            var exec = { role: enums.checkFunctions };
            return exec;
        }
    }, {
        key: "intensivspuelen",
        value: function intensivspuelen() {
            var exec = { role: enums.intensivspuelen };
            return exec;
        }
    }, {
        key: "startSpuelen",
        value: function startSpuelen() {
            var exec = { role: enums.startSpuelen };
            return exec;
        }
    }, {
        key: "setPumpSpeeds",
        value: function setPumpSpeeds(com, speed) {
            var exec = { command: com, speed: speed, role: enums.setPumpSpeeds };
            return exec;
        }
    }, {
        key: "getStat",
        value: function getStat() {
            var exec = { role: enums.getStat };
            return exec;
        }
    }]);

    return Frontend;
}();