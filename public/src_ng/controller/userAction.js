import MainModel from '../../../api/models/UserAction';
import Helper from '../../../api/models/BaseClass';

function Controller($scope, $state, apiHandler, stateManager) {
  $scope.name = 'Nutzeraktionen';
  const deviceId = $state.params.id;

  const columnDefs = Helper.dataGrid(MainModel);

  $scope.gridOptions = {
    columnDefs,
    rowData: [],
    rowHeight: 32,
    angularCompileRows: true,
  };
  $scope.gridOptions.enableFilter = true;

  async function getState() {
    const query = {sort: 'timestamp DESC'};
    if (deviceId) {
      query.device = deviceId;
    }

    Promise.all([
      apiHandler.getItem([], 'userAction', query),
      deviceId ? apiHandler.getItem(deviceId, 'device') : [{}],
    ]).then(([requests, device]) => {
      $scope.rowData = requests;

      $scope.gridOptions.rowData = requests;
      $scope.gridOptions.api.setRowData();
      $scope.gridOptions.api.sizeColumnsToFit();

      $scope.device = device[0];
      $scope.$apply();
    });
  }

  $scope.makeUserAction = (obj) => {
    $scope.actingRequest = angular.copy(obj);
    $('#userActionModal').modal({});
  };

  $scope.rejectRequest = () => {

  };

  function _closeModal() {

  }

  $scope.showCollection = stateManager.stateChange(MainModel.tableName);

  getState($scope);
}

Controller.Template = html`
<div>
  <div device-view device={{device}}></div>
  <div ag-grid="gridOptions" class="ag-fresh" style="height: 900px"></div>
</div>
`;

export default Controller;
