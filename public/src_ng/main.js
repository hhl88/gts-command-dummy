import 'babel-polyfill';
import angular from 'angular';

import {
  ApiHandler, VisualEffects, StateManager, ExcelWriter,
}
from './lib/factory';

import directive from './lib/directive';

import Device from './controller/device';
import ClientRequest from './controller/clientRequest';
import UserAction from './controller/userAction';
import baseClass from './controller/reports/baseClass';
import Navbar from './controller/navbar';

import Login from './controller/login';

import models from '../../api/models/models';

import services from './lib/service';

// angular plugins
import 'angular-ui-router';
import agGrid from 'ag-grid';

agGrid.initialiseAgGridWithAngular1(angular);

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import 'api-check';
import 'angular-formly';
import 'angular-formly-templates-bootstrap';
import 'angular-timeago';

import '../hint.min.css';

import '!style!css!sass!./main.sass';

// things for bootstrap
import 'jquery';
import 'bootstrap';

// we use a theme manager for bootstrap
import 'bootswatch/united/bootstrap.css';

import 'daterangepicker';
import 'daterangepicker/daterangepicker-bs3.css';

// import PouchDB from 'pouchdb';
// window.PouchDB = PouchDB;

const ngApp = angular
  .module('app', ['agGrid', 'ui.router', 'formly', 'formlyBootstrap', 'yaru22.angular-timeago'])

.controller('Navbar', Navbar)

.filter('formatSensor', () => (input) => input && input.cur ? `${input.cur}/${input.max}` : '')

.factory('apiHandler', ApiHandler)
  .factory('visualEffects', VisualEffects)
  .factory('stateManager', StateManager)
  .factory('excelWriter', ExcelWriter)

  .service('AuthService', services.AuthService)

.directive('deviceView', directive.devicePanel);

ngApp.run(($rootScope, $state, AuthService, $location) => {
  $rootScope.$on('$locationChangeStart', function (event, next, current) { // eslint-disable-line
    // redirect to login page if not logged in and trying to access a restricted page
    const restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
    if (restrictedPage && !AuthService.isAuthenticated()) {
      $state.go('login');
    }
  });
});

// router
ngApp.config(($stateProvider, $urlRouterProvider) => {
  // For any unmatched url, redirect to / index
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('', '/');

  // Now set up the states
  $stateProvider
    .state('index', {
      url: '/device',
      template: Device.Template,
      controller: Device,
    })
    .state('login', {
      url: '/login',
      template: Login.Template,
      controller: Login,
    })
    .state('device', {
      url: '/device?id',
      template: Device.Template,
      controller: Device,
    })
    .state('userAction', {
      url: '/userAction?id',
      template: UserAction.Template,
      controller: UserAction,
    })
    .state('clientRequest', {
      url: '/clientRequest?id',
      template: ClientRequest.Template,
      controller: ClientRequest,
    })
    .state('reportDay', {
      url: '/reportDay?id',
      template: baseClass.Template,
      controller: baseClass('reportDay', models.ReportDay),
    })
    .state('transferLog', {
      url: '/transferLog?id',
      template: baseClass.Template,
      controller: baseClass('transferLog', models.TransferLog),
    }).state('reportData', {
      url: '/reportData?id',
      template: baseClass.Template,
      controller: baseClass('reportData', models.ReportData),
    }).state('reportTemp', {
      url: '/reportTemp?id',
      template: baseClass.Template,
      controller: baseClass('reportTemp', models.ReportTemp),
    }).state('reportError', {
      url: '/reportError?id',
      template: baseClass.Template,
      controller: baseClass('reportError', models.ReportError),
    }).state('reportLegio', {
      url: '/reportLegio?id',
      template: baseClass.Template,
      controller: baseClass('reportLegio', models.ReportLegio),
    });
});
