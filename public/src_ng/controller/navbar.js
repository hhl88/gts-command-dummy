function NavbarController($window, $scope, $state, $rootScope, AuthService) {

  $scope.email = () => $rootScope.userEmail;

  $scope.isActive = (state) => {
    const rx = new RegExp(state);
    const res = rx.exec(location.hash);
    const isActive = Boolean(res);
    return isActive;
  };

  $scope.isLoggedIn = () => AuthService.isAuthenticated();

  $scope.logout = () => {
    AuthService.endSession();
    $state.go('login');
  };
}

export default NavbarController;
