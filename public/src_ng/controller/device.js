import MainModel from '../../../api/models/Device';
import Helper from '../../../api/models/BaseClass';

const style = css`
& td.edit-actions {
  width: 20px;
}

& .table {
  font-size: x-small;
  padding: 0px;
}

& .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th,
.table>thead>tr>td, .table>thead>tr>th {
  padding: 0px!important;
}

& .ag-root {
  font-size: 9px!important;
}

& #page-wrapper {
  margin: auto;
}
& nav {
  background: yellow;
}
`;

function DeviceController($scope, $state, apiHandler, visualEffects, stateManager) {
  visualEffects.withStyles(style, `.${this.constructor.name}`);

  const specificDevice = Boolean($state.params.id);

  const columnDefs = Helper.dataGrid(MainModel);

  const actions = {
    headerName: 'Aktionen',
    cellRenderer: Helper.actionsRenderer,
  };

  const logsRenderer = {
    headerName: 'Reports',
    width: 300,
    template: html`
    <div>
    <button class="btn-xs btn-info hint--right"
      data-hint="Report-Daten" ng-click="open(data, 'reportData')">
      D</button>
      <button class="btn-xs btn-info hint--right"
        data-hint="Fehler-Daten" ng-click="open(data, 'reportError')" >
        E</button>
        <button class="btn-xs btn-info hint--right"
          data-hint="Legiotherm-Daten" ng-click="open(data, 'reportLegio')" >
          L</button>
          <button class="btn-xs btn-info hint--right"
            data-hint="Arexx-Daten" ng-click="open(data, 'reportTemp')" >
            T</button>
            <button class="btn-xs btn-info hint--right"
              data-hint="Tages-Daten" ng-click="open(data, 'reportDay')" >
              TG</button>
            <button class="btn-xs btn-info hint--right"
              data-hint="Transfer-Daten" ng-click="open(data, 'transferLog')">
              TL</button>
    </div>

    `,
  };

  $scope.open = (device, state) => {
    $state.go(state, {id: device.id});
  };

  columnDefs.unshift({headerName: 'ID', field: 'id'});
  columnDefs.unshift(logsRenderer);
  columnDefs.unshift(actions);
  $scope.rowData = [];

  $scope.gridOptions = {
    columnDefs,
    rowData: $scope.rowData,
  };

  $scope.gridOptions.rowHeight = 32;
  $scope.gridOptions.fontSize = 32;
  $scope.gridOptions.angularCompileRows = true;
  $scope.gridOptions.enableFilter = true;
  $scope.gridOptions.enableSorting = true;

  $scope.formData = {
    model: {},
  };

  const idForm = {
    key: 'id',
    type: 'input',
    templateOptions: {
      label: 'ID',
      placeholder: 'Wird automatisch generiert',
    },
  };

  $scope.formData.fields = [idForm].concat(Helper.formly({}, MainModel));

  async function getState() {
    apiHandler.getItem(specificDevice ? $state.params.id : [], 'device', {
      sort: 'lastRequest DESC',
    }).then(res => {
      $scope.rowData = res;
      $scope.gridOptions.rowData = res;
      $scope.gridOptions.api.setRowData();
      $scope.gridOptions.api.sizeColumnsToFit();
      $scope.$apply();
    });
  }

  $scope.deleteItem = (obj) => {
    $scope.formData.model = obj;
    $('#confirmModal').modal({});
  };

  $scope._confirmDeleteItem = async() => {
    const resObject = await apiHandler.deleteItem($scope.formData.model, 'device');
    visualEffects.toast.warning('Item deleted');

    for (let i = 0; i < $scope.rowData.length; i++) {
      const e = $scope.rowData[i];
      if (e.id === resObject.id) {
        $scope.rowData.splice(i, 1);
        break;
      }
    }

    $scope.gridOptions.rowData = $scope.rowData;
    $scope.gridOptions.api.setRowData();
    $('#confirmModal').modal('hide');
  };

  $scope.confirmDeleteItem = () => {
    try {
      $scope._confirmDeleteItem();
    } catch (e) {
      console.log(e);
    }
  };

  $scope.createNewItem = () => {
    $scope.formData.model = {newItem: true};
    $('#editModal').modal({});
  };

  $scope.cancelEdit = () => {
    $scope.formData.model = {};
  };

  async function _saveChanges() {
    const isUpdate = Boolean(!$scope.formData.model.newItem);
    delete $scope.formData.model.newItem;
    const data = $scope.formData.model;
    let resObject;
    let message;
    if (isUpdate) {
      // delete because else there will be error in sails
      delete $scope.formData.model.keyRequest;
      delete $scope.formData.model.userAction;
      delete $scope.formData.model.transferLog;

      resObject = await apiHandler.patchItem($scope.formData.model, 'device');
      if (resObject === undefined) {
        visualEffects.toast.error('Update could not be applied');
        return;
      }

      for (let i = 0; i < $scope.rowData.length; i++) {
        const e = $scope.rowData[i];
        if (e.id === resObject.id) {
          $scope.rowData.splice(i, 1, resObject);
          break;
        }
      }

      message = 'Successfully updated';
    } else {
      resObject = await apiHandler.createItem(data, 'device');
      $scope.rowData.unshift(resObject);
      message = 'Successfully created';
    }

    visualEffects.toast.success(message);
    $('#editModal').modal('hide');
    $scope.formData.model = {};

    $scope.gridOptions.rowData = $scope.rowData;
    $scope.gridOptions.api.setRowData();
  }

  $scope.saveChanges = () => {
    try {
      _saveChanges();
    } catch (e) {
      console.log(e);
    }
  };

  $scope.showCollection = stateManager.stateChange(MainModel.tableName);

  $scope.editItem = (obj) => {
    $scope.formData.model = angular.copy(obj);
    $('#editModal').modal({});
  };

  getState();
}

/* eslint-disable */
DeviceController.Template = html`
<div class="${DeviceController.name}">

<div class="well">
  <div class="row">
    <div class="col-sm-1">
      <button class="btn btn-success" ng-click='createNewItem()'>Neuen Eintrag anlegen</button>
    </div>
  </div>
</div>

  <div ag-grid="gridOptions" class="ag-fresh" style="height: 900px"></div>

   <!-- Modal -->
   <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
     <div class="modal-dialog" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 class="modal-title" id="myModalLabel">Bearbeiten</h4>
         </div>
         <div class="modal-body">

           <formly-form model="formData.model" fields="formData.fields">
           </formly-form>
                  </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-default" data-dismiss="modal" ng-click='cancelEdit()'>Close</button>
           <button type="button" class="btn btn-primary" ng-click='saveChanges()'>Speichern</button>
         </div>
       </div>
     </div>
   </div>

   <!-- Modal -->
   <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
     <div class="modal-dialog" role="document">
       <div class="modal-content">

         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 class="modal-title" id="myModalLabel">Bestätigen Sie den Löschvorgang</h4>
         </div>

         <div class="modal-body">
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-default" data-dismiss="modal" ng-click='cancelEdit()'>Schließen</button>
           <button type="button" class="btn btn-warning" ng-click='confirmDeleteItem()'>Löschen</button>
         </div>
       </div>
     </div>
   </div>

</div>
`;
/* eslint-enable */

export default DeviceController;
