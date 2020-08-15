function LoginController($scope, $state, AuthService) {

  $scope.userCreds = {};

  setTimeout(() => {
    if (AuthService.isAuthenticated()) {
      $state.go('index');
    }
  }, 400);

  $scope.postLogin = async() => {
    if (!$scope.userCreds.pass || !$scope.userCreds.email) {
      alert('Nicht alle Felder wurde ausgefüllt');
    }

    await AuthService.authenticate($scope.userCreds);
    $scope.$apply();
    if (AuthService.isAuthenticated()) {
      $state.go('index');
    } else {
      alert('Anmeldung fehlgeschlagen: Überprüfen Sie Ihre Daten.');
    }
  };
}

LoginController.Template = html `
<section class="center-block" style="margin: 0 auto; width: 300px;">
  <form class="form-signin">
          <h2 class="form-signin-heading">Anmelden</h2>
          <label class="sr-only" for="inputEmail">Email-Adresse</label>
          <div class="input-group">
            <input type="email" autofocus="" required="" placeholder="Email-Adresse" class="form-control" ng-model='userCreds.email' id="inputEmail" data-bind='value: emailUser'>
            <label class="sr-only" for="inputPassword">Passwort</label>
            <input type="password" required="" placeholder="Passwort" class="form-control" ng-model='userCreds.pass' id="inputPassword" data-bind='value: passwordUser'>
          </div>
          <button type="submit" class="btn btn-lg btn-primary btn-block" ng-click='postLogin()'>Einloggen</button>
        </form>
</section>
`;

export default LoginController;
