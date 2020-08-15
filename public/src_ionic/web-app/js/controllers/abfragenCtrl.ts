/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:12:00+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-18T21:35:39+01:00
*/

declare var html, require;

import * as _ from 'lodash';
import api = require('../../../../../api_/commandApi');

const Template = require('raw!./abfragenCtrl.html');

interface ISensor {id: string; checked: boolean};
interface ISensorResult {id: string; checked: boolean; out: string; outParsed: number; requestBody: {command: string}};
interface IStat {id; desc; updateFn: (val: string) => void, hidden?};
interface IValue {value};
interface IStatVal extends IStat,IValue {};

function Controller($scope, restApi, commands: api.Frontend, $ionicPopup, $ionicLoading) {

  $scope.pumpwasserTag = [
    {id: 'Warmwasser'},
    {id: 'Kaltwasser'},
  ];

  $scope.spuelwasserTag = [
    {id: 'Warmwasser'},
    {id: 'Kaltwasser'},
  ];

  $scope.pumpen = [
    {id: '1', checked: true},
    {id: '2', checked: false},
    // {id: 3, checked: false},
  ];

  $scope.sensors = [
    {id: '1', checked: true},
    // {id: 2, checked: false},
    // {id: 3, checked: false},
  ];

  $scope.durchflussStats = _.cloneDeep($scope.sensors);
  $scope.volumeStats = _.cloneDeep($scope.sensors);
  $scope.druckStats = { };
  $scope.tempSensors = _.cloneDeep($scope.sensors);

  $scope.filtrationMode = null;

  $scope.getFiltration = async () => {
    const template = () => commands.getFiltration();
    const res = await restApi.executeCommand(template());
    const vals = res.out.trim();
    $scope.filtrationMode = vals;
    $scope.$apply();
  }

  $scope.getStatus = async () => {
    const template = () => commands.getValues();
    const res = await restApi.executeCommand(template());
    const vals = res.out.trim().split(';');

    // TODO: show FNs
    const keys = [
      {id: 'filterId', desc: 'Filter_ID'},
      {id: 'timestamp', desc: 'Messzeitpunkt'},
      {id: 'flowSensor1', desc: 'Durchflusssensor 1',
        updateFn: (val) => $scope.durchflussStats[0].outParsed = parseFloat(val).toFixed(2)},
      {id: 'tempSensor1', desc: 'Temperatursensor 1',
        updateFn: (val) => $scope.tempSensors[0].outParsed = parseFloat(val).toFixed(2)},
      {id: 'sollDrehzahl', desc: 'Soll-Drehzahl'},
      {id: 'istDrehzahl1', desc: 'Ist-Drehzahl Pumpe 1',
        updateFn: (val) => $scope.pumpen[0].outParsed = parseFloat(val) * 100,
        hidden: true,
      },
      {id: 'istDrehzahl2', desc: 'Ist-Drehzahl Pumpe 2',
        updateFn: (val) => $scope.pumpen[1].outParsed = parseFloat(val) * 100,
        hidden: true,
      },
      {id: 'filtrationMode', desc: 'Filtrationsart', updateFn: (val) => $scope.filtrationMode = val},
      {id: 'sumPumpendurchsatz', desc: 'Summe Zählerstand Pumpendurchsatz'},
      {id: 'sumZaehlerstandSpuelen', desc: 'Summe Zählerstand Spülen'},
      {id: 'sumZaehlerstandKWFiltration', desc: 'Summe Zählerstand KW-Filtration'},
      {id: 'sumZaehlerstandKWSpuelen', desc: 'Summe Zählerstand KW-Spülen'},
      {id: 'anzahlBedarfspuelungen', desc: 'Anzahl Bedarfsspülungen'},
      {id: 'cpuTemp', desc: 'CPU Temperatur'},
    ];

    // filter so we get simple the things that can be
    // inserted into the UI without updating any $scope
    const valsMapped: IStatVal[] = keys
      .map((e: IStat, i): IStatVal => Object.assign({}, e, {value: vals[i].toLocaleString()}))
      .filter(e => e.hidden !== true);

    valsMapped.forEach(e => e.updateFn ? e.updateFn(e.value) : null);

    $scope.stats = valsMapped;
    $scope.$apply();
  };

  $scope.getDrehzahl = async () => {
    $scope.pumpen.forEach(e => delete e.out);

    const activated = $scope.pumpen.filter(e => e.checked);
    const template = sensor => commands.getPumpPower(sensor.id);

    let res = await restApi.executeMultiCommands(
      activated.map(sensor => template(sensor)), true);

    $scope.pumpen = $scope.pumpen.map((e: ISensor) => {
      const result: ISensorResult = res.find((e1: ISensorResult) => e1.requestBody.command === e.id);

      if (result) {
        result.outParsed = parseFloat(result.out.trim()) * 100;
        return _.assign(e, result);
      } else {
        return e;
      }

    });

    $ionicLoading.hide()
    $scope.$apply();
  };


  $scope.getTemperature = async () => {
    $scope.tempSensors.forEach(e => delete e.out);

    const activated = $scope.tempSensors.filter(e => e.checked);
    const template = sensor => commands.getTemperature(sensor.id.toString());
    let res = await restApi.executeMultiCommands(
      activated.map(sensor => template(sensor)), true);

    $scope.tempSensors  = $scope.tempSensors.map((e: ISensor) => {
      const result = res.find((e1: ISensorResult) => e1.requestBody.command === e.id);
      if (result) {
        result.outParsed = parseFloat(result.out.trim()).toFixed(2).toLocaleString();
        return _.assign(e, result);
      } else {
        return e;
      }
    });

    $scope.$apply();
  };

  $scope.getDurchfluss = async () => {
    $scope.durchflussStats.forEach(e => delete e.out);

    const activated = $scope.durchflussStats.filter(e => e.checked);
    const template = sensor => commands.getFlow(sensor.id);
    let res = await restApi.executeMultiCommands(
      activated.map(sensor => template(sensor)), true);

    $scope.durchflussStats = $scope.durchflussStats.map(e => {
      const result = res.find((e1: ISensorResult) => e1.requestBody.command === e.id);
      if (result) {
        result.outParsed = parseFloat(result.out.trim()).toFixed(2).toLocaleString();
        return _.assign(e, result);
      } else {
        return e;
      }
    });

    $scope.$apply();
  };


  $scope.getVolume = async () => {
    $scope.volumeStats.forEach(e => delete e.out);

    const activated = $scope.volumeStats.filter(e => e.checked);
    const template = sensor => commands.getVolume(sensor.id.toString());
    let res = await restApi.executeMultiCommands(
      activated.map(sensor => template(sensor)), true
    );

    $scope.volumeStats = $scope.volumeStats.map(e => {
      const result = res.find((e1: ISensorResult) => e1.requestBody.command === e.id);
      if (result) {
        result.outParsed = parseFloat(result.out.trim()).toFixed(2).toLocaleString();
        return _.assign(e, result);
      } else {
        return e;
      }
    });

    $scope.$apply();
  };

  $scope.getDruck = async () => {
    const template = () => commands.getPressure();
    let result = await restApi.executeCommand(template());
    result.outParsed = parseFloat(result.out.trim()).toFixed(2).toLocaleString();
    $scope.druckStats = result;
    $scope.$apply();
  };

  $scope.getDayValues = async () => {
    const template = () => commands.getDayValues();
    let res = await restApi.executeCommand(template());
    res = res.out.trim().split(';');
    const [pumpwasserTagWW, spulwasserTagWW, pumpwasserTagKW, spulwasserTagKW] = res;
    const [pumpwasser, spulwasser] = [[pumpwasserTagWW, pumpwasserTagKW], [spulwasserTagWW, spulwasserTagKW]];
    $scope.pumpwasserTag = $scope.pumpwasserTag.map(
      (e, i) =>
        Object.assign(
          {},
          e,
          pumpwasser[i] === 'n.a.' ? {error: 1} : {outParsed: parseFloat(pumpwasser[i]).toLocaleString()}
        ));

    $scope.spuelwasserTag = $scope.spuelwasserTag.map(
      (e, i) =>
        Object.assign(
          {},
          e,
          spulwasser[i] === 'n.a.' ? {error: 1} : {outParsed: parseFloat(spulwasser[i]).toLocaleString()}
        ));

    $scope.$apply();
  };

}

export default {Controller, Template};
