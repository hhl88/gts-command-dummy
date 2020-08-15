/**
 * @Author: Igor Fischer <igor>
 * @Date:   2016-03-03T21:05:45+01:00
 * @Last modified by:   igor
 * @Last modified time: 2016-04-14T16:42:41+02:00
 */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example
// (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

/* global cordova, StatusBar */
import '../lib/ionic/css/ionic.min.css';
import '../lib/ionic/js/ionic.bundle.js';

import './factories';
import './services';
import './directives';
import './routes';

import '../lib/init-app.js';
import '../lib/init-dev.js';

import '../css/ionic.app.scss';
import '../css/style.css';
import '../css/bootstrap.css';


import 'angular-timeago';

const _ = require('lodash');

async function ngAppStart() {
  angular.bootstrap(document, ['app']);
}


window.ngAppStart = ngAppStart;
angular.module('app',
  ['ionic', 'ngAnimate', 'app.routes', 'app.services', 'app.factories',
    'app.directives', 'yaru22.angular-timeago',
  ])
  .filter('chunk', () => _.memoize(_.chunk))

  .run(($ionicPlatform, AuthService, $location, $state, $rootScope) => {
    $rootScope.$on('$locationChangeStart', function (event, next, current) { // eslint-disable-line
      // redirect to login page if not logged in and trying to access a restricted page
      // const restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
      // if (restrictedPage && !AuthService.isAuthenticated()) {
      //   $state.go('login');
      // }
    });

    $ionicPlatform.ready(() => {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  });
