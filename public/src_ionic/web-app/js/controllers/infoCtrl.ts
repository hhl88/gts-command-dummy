const Template = require('raw!./infoCtrl.html');

function Controller($scope, restApi) {

  $scope.device = {};

  async function getMeta() {
    const device = await restApi.getMeta();
    const location = device.location.split('|');
    device.street = location[0];
    device.zip = location[1];
    device.city = location[2];
    $scope.device = device;
    $scope.$apply();
  }

  $scope.getMeta = getMeta;
  getMeta();
}

export default {Template, Controller};
