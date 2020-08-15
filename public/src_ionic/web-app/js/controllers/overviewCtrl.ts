/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:11:36+01:00
* @Last modified by:   igor
* @Last modified time: 2016-04-08T20:43:51+02:00
*/

declare var require;
import api = require('../../../../../api_/commandApi');
const _ = require('lodash');

const Template = require('raw!./overviewCtrl.html');

function Controller($scope, restApi, commands: api.Frontend) {

  const ventile = () => {
    const vents = [
      {cmd: '100000', id: 'Spülventil V1', checked: false},
      {cmd: '010000', id: 'Rückspülventil V2', checked: false},
      {cmd: '001000', id: '3', checked: false},
      {cmd: '000100', id: 'Kugelventil V4', checked: false},
      {cmd: '000010', id: '5', checked: false},
      {cmd: '000001', id: '6', checked: false},
    ];
    return _.cloneDeep(vents);
  }

  $scope.ventileStatus = ventile();
  $scope.isOpen = ventil => ventil.open;
  $scope.ventileStatusChecked = false;

  $scope.pumpeProps = {};
  $scope.pumpeProps.status = true;
  $scope.pumpePropsChecked = false;

  $scope.getStatusVentile = async () => {
    $scope.ventileStatusChecked = false;

    const template = () => commands.getValves();
    const res = await restApi.executeCommand(template(), false);

    // TODO: only simulation
    const resVentils = res.out.split(';');
    const cp = ventile();
    $scope.ventileStatus = cp.map((e, i) =>  Object.assign({}, e, {open: resVentils[i] === '1'}));
    $scope.lastTimeChecked = new Date();
    $scope.ventileStatusChecked = true;
    $scope.$apply();
  }

  $scope.checkPumpe = async () => {
    $scope.pumpePropsChecked = false;

    const template = () => commands.getPump();
    const res = await restApi.executeCommand(template(), false);

    // TODO: parse result
    switch (res.out) {
      case '0':
        $scope.pumpeProps.status = false;
        break;
      case '1':
        $scope.pumpeProps.status = true;
        break;
      default:
        console.log('No option matching', res.out);
      }

    $scope.lastTimeCheckedPumpe = new Date();
    $scope.pumpePropsChecked = true;
    $scope.$apply();
  }

  $scope.hasAlerts = false;
  $scope.alertsChecked = false;
  async function getAlerts() {
    $scope.alertsChecked = false;

    const template = () => commands.getAlerts();
    const response = await restApi.executeCommand(template(), false);
    const alertStrings = response.out.trim().split('\n');
    const res = alertStrings.find(e => e === 'alarm active');
    $scope.hasAlerts = res ? true : false;
    $scope.alertsChecked = true;
    $scope.$apply();
  }

  $scope.getState = async () => {
    await Promise.all([$scope.getStatusVentile(), $scope.checkPumpe(), getAlerts()])
  }

  $scope.getState().catch(console.log);
}

export default {Controller, Template};
