/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:14:43+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-25T23:39:12+01:00
*/

declare var require;

import * as _ from 'lodash';
import api = require('../../../../../api_/commandApi');
const Template = require('raw!./sonstigesCtrl.html');

declare var html;

function Controller($scope, restApi, commands: api.Frontend, $ionicLoading, $ionicPopup) {
  $scope.resetAlarms = async () => {
    const template = () => commands.resetAlarms();
    await restApi.executeCommand(template());
  };

  $scope.valuesToSD = async () => {
    const template = () => commands.valuesToSD();
    await restApi.executeCommand(template());
  };

  $scope.resetCounter = async () => {
    const template = () => commands.resetCounter();
    await restApi.executeCommand(template());
  };

  $scope.saveServer = async () => {
    const template = () => commands.saveServer();
    await restApi.executeCommand(template());
  };

  $scope.fetchconfig = async () => {
    const template = () => commands.fetchconfig();
    await restApi.executeCommand(template());
  };

  // TODO: the reset doesn't work so the button in the ui is out-commented
  $scope.resetInit = async () => {
    $ionicLoading.show();
    await restApi.resetPi();
    $ionicLoading.hide();

    await $ionicPopup.alert({title: 'Reset', template: 'Sie werden gleich zur Initialisierung weitergeleitet.'})

    $ionicLoading.show();
    const newLoc = location.host.replace('1339', '1338');
    checkAppOnline('http://' + newLoc);
  };


  function checkAppOnline(url, reload = false) {
    console.log('Check start');
    setInterval(async () => {
      console.log('Checking app at', url);
      const out = await restApi.checkCommandAppOnline(url);
      console.log('App online:', out);
      if (out) {
        $ionicLoading.hide();
        location.href = url;
        if (reload) {
          location.reload();
        }
      }
    }, 3000);
  }

}

export default {Controller, Template};
