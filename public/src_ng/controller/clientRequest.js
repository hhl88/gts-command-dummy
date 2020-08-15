import MainModel from '../../../api/models/ClientRequest';
import Helper from '../../../api/models/BaseClass';

function Controller($scope, $state, apiHandler, visualEffects, stateManager) {
  $scope.name = $state.params.id || 'Allgemein';
  const deviceId = $state.params.id;

  const columnDefs = Helper.dataGrid(MainModel);
  const actionsRenderer = () =>
    `<div>
     <button class="btn-xs btn-info" ng-click="makeUserAction(data)">
       Useraktion</button>
     </div>`;

  const actions = {
    headerName: 'Aktionen',
    cellRenderer: actionsRenderer,
  };
  columnDefs.unshift(actions);

  $scope.gridOptions = {
    columnDefs,
    rowData: [],
    rowHeight: 32,
    angularCompileRows: true,
  };

  $scope.actingRequest = {};
  $scope.gridOptions.enableFilter = true;

  async function getState() {
    const query = {sort: 'timestamp DESC'};
    if (deviceId) {
      query.device = deviceId;
    }

    Promise.all([
      apiHandler.getItem([], 'clientRequest', query),
      deviceId ? apiHandler.getItem(deviceId, 'device') : [{}],
    ]).then(([requests, device]) => {
      $scope.rowData = requests;

      $scope.gridOptions.rowData = requests;
      $scope.gridOptions.api.setRowData();
      $scope.gridOptions.api.sizeColumnsToFit();

      $scope.device = device[0];
      $scope.$apply();
    }).catch(visualEffects.toast.error);
  }

  $scope.makeUserAction = (obj) => {
    $scope.actingRequest = angular.copy(obj);
    $('#userActionModal').modal({});
  };

  async function acceptOrReject(val) {
    const obj = {
      clientRequest: $scope.actingRequest.id,
      timestamp: new Date().toJSON(),
      device: $scope.actingRequest.device,
      location: '',
      ip: $scope.actingRequest.ip,
      action: val,
      user: '7656c1ec-0f6a-733c-5208-6d29d268afd7',
      note: $scope.actingRequest.note,
    };

    $scope.actingRequest.action = val;

    await apiHandler.createItem(obj, 'userAction');
    const resObject = await apiHandler.patchItem($scope.actingRequest, 'clientRequest');

    for (let i = 0; i < $scope.rowData.length; i++) {
      const e = $scope.rowData[i];
      if (e.id === resObject.id) {
        $scope.rowData.splice(i, 1, resObject);
        break;
      }
    }

    $scope.gridOptions.rowData = $scope.rowData;
    $scope.gridOptions.api.setRowData();

    $scope.actingRequest = {};
    $('#userActionModal').modal('hide');
  }

  $scope.rejectRequest = () => {
    acceptOrReject('REJECTED');
  };

  $scope.acceptRequest = async () => {
    acceptOrReject('ACCEPTED');
  };

  // function _closeModal() {
  //   $scope.actingRequest = {};
  //   $('#userActionModal').modal('hide');
  // }

  $scope.showCollection = stateManager.stateChange(MainModel.tableName);

  getState($scope);
}

/* eslint-disable */
Controller.Template = html`
<div>

    <div device-view device={{device}}></div>

  <div ag-grid="gridOptions" class="ag-fresh" style="height: 900px"></div>

  <!-- Modal -->
  <div class="modal fade" id="userActionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">Anfrage bearbeiten</h4>
        </div>
        <div class="modal-body">

          <table class="table borderless">
            <tbody>
              <tr>
                <td><strong>Zeit: </strong></td>
                <td class="text-right" >{{actingRequest.timestamp | date: 'DD.MM.YYYY HH:MM'}}</td>
              </tr>
              <tr>
                <td><strong>Straße: </strong></td>
                <td class="text-right" data-bind="text: location">{{device.customer}}</td>
              </tr>
              <tr>
                <td><strong>Geräte ID: </strong></td>
                <td class="text-right" data-bind="text: id">{{device.id}}</td>
              </tr>
              <tr>
                <td><strong>Geräte IP: </strong></td>
                <td class="text-right" data-bind="text: ip">{{actingRequest.ip}}</td>
              </tr>
              <tr>
                <td><strong>Notiz: </strong></td>
                <td class="text-right" data-bind="text: ip">
                  <input class="text-right form-control" ng-model="actingRequest.note">
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal" ng-click='cancelEdit()'>Schließen</button>
          <button type="button" class="btn btn-danger" ng-click='rejectRequest()'>Ablehnen</button>
          <button type="button" class="btn btn-success" ng-click='acceptRequest()'>Akzeptieren</button>
        </div>
      </div>
    </div>
  </div>

</div>
`;

export default Controller;
