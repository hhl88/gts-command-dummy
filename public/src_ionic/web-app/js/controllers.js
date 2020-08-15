
import befehleCtrl from './controllers/befehleCtrl';
import loginCtrl from './controllers/loginCtrl';
import abfragenCtrl from './controllers/abfragenCtrl';
import manuelleSteuerungCtrl from './controllers/manuelleSteuerungCtrl';
import automatikCtrl from './controllers/automatikCtrl';
import systemCtrl from './controllers/systemCtrl';
import sonstigesCtrl from './controllers/sonstigesCtrl';
import transferCtrl from './controllers/transferCtrl';
import einstellungenCtrl from './controllers/einstellungenCtrl';
import konfigurationCtrl from './controllers/konfigurationCtrl';
import dashboardCtrl from './controllers/dashboardCtrl';
import infoCtrl from './controllers/infoCtrl';


angular.module('app.controllers', [])

.controller('befehleCtrl', befehleCtrl)

.controller('loginCtrl', loginCtrl)

.controller('abfragenCtrl', abfragenCtrl)

.controller('manuelleSteuerungCtrl', manuelleSteuerungCtrl)

.controller('automatikCtrl', automatikCtrl)

.controller('systemCtrl', systemCtrl)

.controller('sonstigesCtrl', sonstigesCtrl)

.controller('transferCtrl', transferCtrl)

.controller('einstellungenCtrl', einstellungenCtrl)

.controller('konfigurationCtrl', konfigurationCtrl)

.controller('dashboardCtrl', dashboardCtrl)

.controller('infoCtrl', infoCtrl);
