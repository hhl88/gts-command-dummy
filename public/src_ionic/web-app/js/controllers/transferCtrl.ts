/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-11T17:14:51+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-29T12:48:05+02:00
*/

function Controller($scope, restApi) {
  $scope.saveServer = async () => {
    const template = 'transfer.sh';
    await restApi.executeCommand(template);
  };

  $scope.saveConfigOnServer = async () => {
    const template = 'transfer_config.sh';
    await restApi.executeCommand(template);
  };
}

const Template = `
<ion-view title="Transfer">
    <ion-content overflow-scroll="true" padding="true" class="has-header">
        <div class="list card">
            <div class="item item-body">
                <button class="button button-stable button-block "
                    ng-click="saveServer()">Messwerte auf Server seichern</button>
                <button class="button button-stable button-block "
                    ng-click="saveConfigOnServer()">Skripte auf Server speichern</button>
            </div>
        </div>
    </ion-content>
</ion-view>
`;

export default {Controller, Template};
