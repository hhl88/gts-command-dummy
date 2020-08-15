import commands from '../../../../api_/commandApi';

function AuthService($rootScope, $state) {
  const _this = this;
  _this.isAuthenticated = false;
  _this.user = {};

  const cookieName = 'accept_token';

  async function _sessionIsValid() {
    console.log('Checking session');
    try {
      const res = await Promise.resolve($.post('/api/getSession'));
      $rootScope.userEmail = res.email;
      _this.isAuthenticated = true;
      _this.user = res;
    } catch (e) {
      _this.isAuthenticated = false;
      $state.go('login');
    }
  }

  function isAuthenticated() {
    return _this.isAuthenticated;
  }

  function identity() {
    return _this.user;
  }

  function endSession() {
    function eraseCookie(name) {
      document.cookie = `${name}=; Max-Age=0`;
    }

    eraseCookie(cookieName);
    _this.isAuthenticated = false;
    _this.user = {};
  }

  async function authenticate(userObj) {
    try {
      // getting the cookie
      await Promise.resolve($.post('/api/createSession', userObj));
      const res = await Promise.resolve($.post('/api/getSession', userObj));
      $rootScope.userEmail = res.email;
      _this.isAuthenticated = true;
      _this.user = res;
    } catch (e) {
      _this.isAuthenticated = false;
      _this.user = {};
    }
  }

  _sessionIsValid().catch(console.log);

  return {
    isAuthenticated,
    authenticate,
    identity,
    endSession,
  };
}

angular.module('app.services', [])

.service('commands', () => new commands.Frontend)

.service(AuthService.name, AuthService);
