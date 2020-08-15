/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:14:43+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-25T23:39:12+01:00
*/

declare var require;

import * as _ from 'lodash';
import api = require('../../../../../api_/commandApi');
const Template = require('raw!./alarmCtrl.html');

declare var html;

function Controller($scope, restApi, commands: api.Frontend) {


  let alerts = {
    GET_ALARM_ARDUINO: 0,
    GET_ALARM_PUMP_MIN_FLOW: 0,
    GET_ALARM_PUMP_MAX_FLOW: 0,
    GET_ALARM_VALVE_OFF_MAX_FLOW: 0,
  };

  $scope.hasAlert = (part) => {
    return alerts[part];
  };

  $scope.resetAlarms = async () => {
    const template = () => commands.resetAlarms();
    await restApi.executeCommand(template());
    getAlerts();
  };

  async function getAlerts() {
    const template = () => commands.getAlerts();
    const response = await restApi.executeCommand(template());
    const alertStrings = response.out.trim().split('\n');
    alerts = Object.keys(alerts).reduce((a, e, i) => {
      const possibleAlert = alertStrings[i];
      let hasAlert = 0;
      if (possibleAlert === 'alarm not active') {
        hasAlert = 0;
      } else {
        hasAlert = 1;
      }

      a[e] = hasAlert;
      return a;
    }, Object.assign({}, alerts));
    console.log(alerts);

    $scope.$apply();
  }

  getAlerts();
  $scope.getAlerts = getAlerts;
}

export default {Controller, Template};
