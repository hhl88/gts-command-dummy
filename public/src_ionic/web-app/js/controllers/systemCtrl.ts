/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:13:23+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-18T21:22:29+01:00
*/

declare var require;

import * as _ from 'lodash';
import api = require('../../../../../api_/commandApi');

const Template = require('raw!./systemCtrl.html');

declare var html;

function Controller($scope, restApi, $ionicPopup, commands: api.Frontend) {
  // A confirm dialog
  $scope.systemReboot = function(str, fn) {
    const template = () => commands.bootSystem();

    const confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: `Bestätigen Sie den Neustart des Systems`,
    });

    confirmPopup.then(async (res: boolean) => {
      if(res) {
        await restApi.executeCommand(template());

      } else {
        console.log('You are not sure');
      }
    });
  };

  // A confirm dialog
  $scope.systemHalt = function(str, fn) {
    const template = () => commands.haltSystem();

    const confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: `Bestätigen Sie das Ausschalten des Systems`,
    });

    confirmPopup.then(async (res) => {
      if(res) {
        await restApi.executeCommand(template());

      } else {
        console.log('You are not sure');
      }
    });
  };
}

export default {Controller, Template};
