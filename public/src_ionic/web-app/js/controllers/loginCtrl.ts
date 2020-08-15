declare var require;

const Template = require('raw!./loginCtrl.html');

function Controller($scope, $state, restApi, AuthService, $ionicPopup, $ionicLoading) {

  $scope.user = {
    password: '',
    username: '',
  };

  $scope.login = async () => {
    if (!$scope.user.username || !$scope.user.password) {
      $ionicPopup.alert({title: 'Credentials', template: 'Zugangsdaten sind nicht korrekt ausgefüllt!'})
    }

    await AuthService.authenticate($scope.user);
    if (AuthService.isAuthenticated()) {
      $ionicLoading.show()
      setTimeout(() => {
        $ionicLoading.hide()
        $state.go('tabsController.befehle');
      }, 3000);
    } else {
      $ionicPopup.alert({title: 'Credentials', template: 'Login konnte nicht durchgeführt werden. Kontrollieren Sie Ihre Zugangsdaten und die Internetverbindung.'})
    }
  }
}

export default {Controller, Template};
