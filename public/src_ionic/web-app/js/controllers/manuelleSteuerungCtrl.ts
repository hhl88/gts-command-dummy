/**
 * @Author: Igor Fischer <igor>
 * @Date:   2016-03-11T17:12:18+01:00
 * @Last modified by:   igor
 * @Last modified time: 2016-03-18T19:35:27+01:00
 */

declare var require;

import * as _ from 'lodash';
import api = require('../../../../../api_/commandApi');

const Template = require('raw!./manuelleSteuerungCtrl2.html');

function Controller($scope, restApi, commands: api.Frontend, $ionicPopup) {
  const ventile = () => {
    const vents = [
      {cmd: '100000', id: 'V1', label: '1-SV', online: false, open: true},
      {cmd: '010000', id: 'V2', label: '1-EV', online: false},
      {cmd: '001000', id: 'V3', label: '3', online: false},
      {cmd: '000100', id: 'V4', label: '4-MV', online: false},
      {cmd: '000010', id: 'V5', label: '5', online: false},
    ];
    return _.cloneDeep(vents);
  };


  $scope.ventile = ventile();
  $scope.ventileOpenClose = ventile();

  $scope.pumpen = [
    {cmd: '', id: 1, label: 'Pumpe', value: 'P', online: false, dataKey: 'pump-1'},
    // {cmd: '', id: 2},
  ];

  $scope.sensors = [
    {id: 1, label: 'Levelsensor', value: 'LA', online: false, dataKey: 'sensor-1'}
    // {id: 2, checked: false},
    // {id: 3, checked: false},
  ];

  $scope.lastTimeChecked = new Date();

  $scope.statistics = [
    {id: "F1", label: "Durchfluss (l/min)", value: "18,9"},
    {id: "D", label: "Druck (bar)", value: "18,9"},
    {id: "T1", label: "Temperature (°C)", value: "18,9"},
    {id: "F2", label: "Durchfluss 2 (l/min)", value: "0"},
  ];
  $scope.pumpSpeed = [
    {id: 'pump-speed-0', label: "0", value: 0},
    {id: 'pump-speed-25', label: "25", value: 25},
    {id: 'pump-speed-50', label: "50", value: 50},
    {id: 'pump-speed-60', label: "60", value: 60},
    {id: 'pump-speed-70', label: "70", value: 70},
    {id: 'pump-speed-75', label: "75", value: 75},
    {id: 'pump-speed-80', label: "80", value: 80},
    {id: 'pump-speed-85', label: "85", value: 85},
    {id: 'pump-speed-100', label: "100", value: 100},
  ];
  $scope.pumps = [
    {id: '1', label: 'Einstellung P1'},
    {id: '2', label: 'Einstellung P2'},
    {id: 'all', label: 'Einstellen und Speichern P1+P2'}
  ];
  $scope.programmButtons = [
    {id: 'filter_rinse', label: 'Filtration mit Spülvorgang starten', click: () => $scope.startSpuelen()},
    {
      id: 'filter_intensive_rinse',
      label: 'Filtration mit Intensivspülen starten',
      click: () => $scope.intensivspuelen()
    },
    {id: 'backwashing', label: 'Rückspülung durchführen', click: () => $scope.rueckspuelen()},
    {id: 'check_functions', label: 'Funktionstest', click: () => $scope.checkFunctions()}
  ];

  $scope.pulse = {};
  $scope.pulse.pulseMillisecons = 3000;
  $scope.pulse.pulseN = 5;
  $scope.pulse.pulseWait = 5;

  $scope.activatedItems = {
    open: [],
    ventils: [],
    close: [],
    pulse: [],
    pumpen: [],
    pumpSpeeds: []
  };

  $scope.pumpeProps = {};
  $scope.pumpeProps.status = false;
  $scope.lastTimeCheckedPumpe = new Date();
  $scope.manualModus = {};
  $scope.manualModus.status = true;

  $scope.isOnline = ventil => ventil.online;

  $scope.isActivated = (what, item) => Boolean($scope.activatedItems[what].find(e => e.id === item.id));

  function handleResponse(text, regexMatch, isBoolean = true) {
    const result = {};
    let value = regexMatch.exec(text);

    while (value != null) {
      const arr = value[0].split(':');
      result[arr[0]] = isBoolean ? arr[1] === '1' : arr[1];
      value = regexMatch.exec(text);
    }
    return result;
  }

  async function toggleManualMode(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }

    const com = $scope.manualModus.status ? 'MANUAL' : 'AUTOMATIC';
    const template = () => commands.switchMode(com);
    const res = await restApi.executeCommand(template(), true, false);

    const comManual = 'switching to manual mode';
    const comAutomatic = 'switching to automatic mode';
    if (res.out.indexOf(comManual) > -1) {
      $scope.manualModus.status = true;
    }

    if (res.out.indexOf(comAutomatic) > -1) {
      $scope.manualModus.status = false;
    }
    await getMode();
  }

  async function getMode() {
    const template = () => commands.switchMode('GET');
    const res = await restApi.executeCommand(template(), true, false);
    console.log(res);
    $scope.manualModus.status = res.out.trim() === 'MANUAL' ? true : false;

    if ($scope.manualModus.status) {
      await $scope.checkStatus();
    }

    $scope.$apply();
  }

  async function setPump(com) {
    const template = (item) => commands.setPump(item.cmd);
    await restApi.executeCommand(template({cmd: com}));
    await getStats();
  }

  function checkValuesSelected(ar) {
    if (ar.length) {
      return true;
    } else {
      $ionicPopup.alert({template: 'Nichts selektiert'});
      return false;
    }
  }

  async function setVentile(com) {
    const rawVentile = ventile();
    const activated = $scope.activatedItems.ventils;

    const toTriggerVentils = rawVentile
      .reduce((a, e) => a + ($scope.activatedItems.ventils.find(e1 => e1.id === e.id) ? '1' : '0'), '');
    if (!checkValuesSelected(activated)) return;
    const template = item => commands.setValves(com, item.cmd);
    const res = await restApi.executeCommand(template({cmd: toTriggerVentils + '0'}));

    $scope.activatedItems.ventils = [];

    await getStats();
    $scope.$apply();
  }


  async function checkWaterFlow2() {
    const template = () => commands.getFlow('2');
    const res = await restApi.executeCommand(template(), true, false);
    if (res.out) {
      const idx = $scope.statistics.findIndex(item => item.id === 'F2');
      $scope.statistics[idx].value = res.out;
      $scope.$apply();
    }
  }


  function handleNewStatistic(values) {
    return $scope.statistics.map((e, i) => {
      if (values.hasOwnProperty(e.id)) {
        return Object.assign({}, e, {value: values[e.id]})
      }
      return e
    });
  }

  async function getStats() {
    const template = () => commands.getStat();
    const res = await restApi.executeCommand(template(), true, false);

    const pumpValues = handleResponse(res.out, /P.?:\d/g);
    const senrorValues = handleResponse(res.out, /LA.?:\d/g);
    const ventileValues = handleResponse(res.out, /V.?:\d/g);
    const tempValues = handleResponse(res.out, /T.?:[+-]?\d+\.\d+/g, false);
    const flowValues = handleResponse(res.out, /F.?:\d+\.\d+/g, false);
    const pressureValues = handleResponse(res.out, /D:\d+\.\d+/g, false);

    $scope.statistics = handleNewStatistic(tempValues);
    $scope.statistics = handleNewStatistic(flowValues);
    $scope.statistics = handleNewStatistic(pressureValues);


    $scope.ventile = $scope.ventile.map((e, i) => Object.assign({}, e, {online: ventileValues[e.id]}));
    $scope.pumpen = $scope.pumpen.map((e, i) => Object.assign({}, e, {online: pumpValues[e.value]}));
    $scope.sensors = $scope.sensors.map((e, i) => Object.assign({}, e, {online: senrorValues[e.value]}));

    $scope.lastTimeChecked = new Date();
    $scope.$apply();
  }


  $scope.checkStatus = async () => {
    await getStats();
    await checkWaterFlow2();
  };


  $scope.setZero = async () => {
    $scope.sensors.forEach(e => delete e.out);
    const activated = $scope.sensors.filter(e => e.checked);
    const template = sensor => commands.setZero(sensor.id.toString());
    let res = await Promise.all(activated
      .map(sensor => restApi.executeCommand(template(sensor))));
    $scope.$apply();
  };

  $scope.pulseVentil = async () => {
    try {
      const activated = $scope.activatedItems.pulse;

      if (!checkValuesSelected(activated)) return;

      const template = item =>
        commands.setValvePulse('', item.id, $scope.pulse.pulseMillisecons, $scope.pulse.pulseWait * 1000, $scope.pulse.pulseN);
      const res = await Promise.all(activated
        .map(item => restApi.executeCommand(template(item), true, false)));
      $scope.activatedItems.pulse = [];
      $scope.$apply();
    } catch (e) {
      console.log(e);
    }
  };

  $scope.toggleList = (what, item, onlyOne = false) => {
    const ix = $scope.activatedItems[what].findIndex(e => e.id === item.id);
    if (ix === -1) {
      if (onlyOne) {
        $scope.activatedItems[what] = [item];
      } else {
        $scope.activatedItems[what].push(item);
      }
    } else {
      $scope.activatedItems[what].splice(ix, 1);
    }
  };


  $scope.openVentil = async () => {
    await setVentile('ON');
  };

  $scope.closeVentil = async () => {
    await setVentile('OFF');
  };

  $scope.setPumpSpeed = async (pump) => {
    const pumpSpeed = $scope.activatedItems.pumpSpeeds;
    if (!checkValuesSelected(pumpSpeed)) return;
    try {
      if (pump.id === 'all') {
        const template = (item) => commands.setPumpSpeeds('', item.cmd);
        const res = await restApi.executeCommand(template({cmd: pumpSpeed[0].value}));
      } else {
        const template = (item) => commands.setPumpSpeed('', item.pump, item.speed);
        const res = await restApi.executeCommand(template({pump: pump.id, speed: pumpSpeed[0].value}));
      }

      $scope.activatedItems.pumpSpeeds = [];
      await getStats();
      $scope.$apply();
    } catch (e) {
      console.log(e);
    }
  };

  $scope.openPumpRelay = async () => {
    await setPump('ON');
  };

  $scope.closePumpRelay = async () => {
    await setPump('OFF');
  };

  async function setOperationReport(com) {
    const template = item => commands.setOperationReport(item.cmd);
    const res = await restApi.executeCommand(template({cmd: com}));
    await getStats();
  }

  $scope.openReport = async () => {
    await setOperationReport('ON');
  };

  $scope.closeReport = async () => {
    await setOperationReport('OFF');
  };


  $scope.startPlant = async () => {
    const template = () => commands.startPlant();
    const res = await restApi.executeCommand(template(), true, false);
  };

  $scope.timerStart = async () => {
    const template = () => commands.timerStart();
    const res = await restApi.executeCommand(template());
    await getStats();
  };

  $scope.timerStartKW = async () => {
    const template = () => commands.timerStartKW();
    const res = await restApi.executeCommand(template());
    await $scope.checkPumpe();
  };

  $scope.timerStop = async () => {
    const template = () => commands.timerStop();
    const res = await restApi.executeCommand(template());
    await getStats();
  };

  $scope.timerStopKS = async () => {
    const template = () => commands.timerStopKS();
    const res = await restApi.executeCommand(template());
    await getStats();
  };

  $scope.startSpuelen = async () => {
    const template = () => commands.startSpuelen();
    const res = await restApi.executeCommand(template(), true, false);
  };

  $scope.intensivspuelen = async () => {
    const template = () => commands.intensivspuelen();
    const res = await restApi.executeCommand(template(), true, false);
  };

  $scope.rueckspuelen = async () => {
    const template = () => commands.rueckspuelen();
    const res = await restApi.executeCommand(template(), true, false);
  };

  $scope.checkFunctions = async () => {
    const template = () => commands.checkFunctions();
    const res = await restApi.executeCommand(template(), true, false);
  };


  getMode()
    .then(() => $scope.$watch('manualModus.status', toggleManualMode, true))
    .catch(console.log);
}

export default {Controller, Template};
