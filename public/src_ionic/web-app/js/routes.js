import overviewCtrl from './controllers/overviewCtrl';
import loginCtrl from './controllers/loginCtrl';
import abfragenCtrl from './controllers/abfragenCtrl';
import manuelleSteuerungCtrl from './controllers/manuelleSteuerungCtrl';
import systemCtrl from './controllers/systemCtrl';
import sonstigesCtrl from './controllers/sonstigesCtrl';
import transferCtrl from './controllers/transferCtrl';
import einstellungenCtrl from './controllers/einstellungenCtrl';
import konfigurationCtrl from './controllers/konfigurationCtrl';
import dashboardCtrl from './controllers/dashboardCtrl';
import infoCtrl from './controllers/infoCtrl';
import alarmCtrl from './controllers/alarmCtrl';

angular.module('app.routes', [])

.config(($stateProvider, $urlRouterProvider) => {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController.befehle', {
    cache: false,
    url: '/hauptmenu',
    views: {
      tab1: {
        template: overviewCtrl.Template,
        controller: overviewCtrl.Controller,
      },
    },
  })

  // <ion-tab title="Einstellungen" icon="ion-settings" href="#/app/settings">
  // <ion-nav-view name="tab2"></ion-nav-view>
  // </ion-tab>
  // <ion-tab title="History" icon="ion-arrow-swap">
  // <ion-nav-view name="tab4"></ion-nav-view>
  // </ion-tab>
  // <ion-tab title="Dashboard" icon="ion-ios-calculator" href="#/app/dashboard">
  // <ion-nav-view name="tab5"></ion-nav-view>
  // </ion-tab>
  .state('tabsController', {
    url: '/app',
    template: `
    <ion-view title="Tabs Controller">
      <ion-tabs class="tabs-stable tabs-icon-top">
        <ion-tab title="Steuerung" icon="ion-android-desktop" href="#/app/befehle">
          <ion-nav-view name="tab1"></ion-nav-view>
        </ion-tab>
        <ion-tab title="Info" icon="ion-information" href="#/app/info">
          <ion-nav-view name="tab3"></ion-nav-view>
        </ion-tab>
      </ion-tabs>
    </ion-view>
    `,
    abstract: true,
  })

  .state('login', {
    url: '/login',
    template: loginCtrl.Template,
    controller: loginCtrl.Controller,
  })

  .state('tabsController.abfragen', {
    url: '/abfragen',
    views: {
      tab1: {
        template: abfragenCtrl.Template,
        controller: abfragenCtrl.Controller,
      },
    },
  })

  .state('tabsController.manuelleSteuerung', {
    cache: false,
    url: '/manuel-usage',
    views: {
      tab1: {
        template: manuelleSteuerungCtrl.Template,
        controller: manuelleSteuerungCtrl.Controller,
      },
    },
  })

  .state('tabsController.system', {
    url: '/system',
    views: {
      tab1: {
        template: systemCtrl.Template,
        controller: systemCtrl.Controller,
      },
    },
  })

  .state('tabsController.sonstiges', {
    url: '/other',
    views: {
      tab1: {
        template: sonstigesCtrl.Template,
        controller: sonstigesCtrl.Controller,
      },
    },
  })

  .state('tabsController.transfer', {
    url: '/transfer',
    views: {
      tab1: {
        template: transferCtrl.Template,
        controller: transferCtrl,
      },
    },
  })

  .state('tabsController.alarm', {
    url: '/alarm',
    views: {
      tab1: {
        template: alarmCtrl.Template,
        controller: alarmCtrl.Controller,
      },
    },
  })

  .state('tabsController.einstellungen', {
    url: '/settings',
    views: {
      tab2: {
        template: einstellungenCtrl.Template,
        controller: einstellungenCtrl,
      },
    },
  })

  .state('tabsController.konfiguration', {
    url: '/item-config',
    views: {
      tab2: {
        template: konfigurationCtrl.Template,
        controller: konfigurationCtrl,
      },
    },
  })

  .state('tabsController.dashboard', {
    url: '/dashboard',
    views: {
      tab5: {
        template: dashboardCtrl.Template,
        controller: dashboardCtrl,
      },
    },
  })

  .state('tabsController.info', {
    url: '/info',
    views: {
      tab3: {
        template: infoCtrl.Template,
        controller: infoCtrl.Controller,
      },
    },
  });
  $urlRouterProvider.otherwise('/app/hauptmenu');
});
