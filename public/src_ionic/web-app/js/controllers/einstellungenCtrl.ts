/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:14:59+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-18T23:20:21+01:00
*/

function Controller($scope) {

}

const Template = `
<ion-view title="Einstellungen">
    <ion-content overflow-scroll="true" padding="true" class="has-header">
      <ion-card>
        Bei Benutzung über den Browser kann diese Ansicht ignoriert werden.
      </ion-card>

        <a ui-sref="tabsController.konfiguration" class="button button-stable button-block ">Konfiguration ergänzen</a>
        <ion-list></ion-list>
        <ion-list>
            <ion-item ui-sref="tabsController.konfiguration">Solvis</ion-item>
            <ion-item ui-sref="tabsController.konfiguration">Aschoopstwiete</ion-item>
            <ion-item ui-sref="tabsController.konfiguration">Alsterchaussee18</ion-item>
        </ion-list>
    </ion-content>
</ion-view>
`;

export default Controller;
