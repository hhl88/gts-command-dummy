import Helper from '../../../../api/models/BaseClass';
import moment from 'moment';

const DataController = (col, MainModel) => {
  function Controller($scope, $state, apiHandler, stateManager, excelWriter) {
    const deviceId = $state.params.id;

    const columnDefs = Helper.dataGrid(MainModel);

    let startDate = moment().startOf('day');
    let endDate = moment().endOf('day');

    $scope.gridOptions = {
      columnDefs,
      rowData: [],
    };

    $scope.gridOptions.angularCompileRows = true;

    async function getState() {
      const query = {
        sort: 'timestamp DESC',
        where: {
          timestamp:
            {
              '>=': startDate.toISOString(),
              '<=': endDate.toISOString(),
            },
        },
      };
      if (deviceId) {
        query.where.device = deviceId;
      }

      const [requests, device] = await Promise.all([
        apiHandler.getItem([], col, query),
        deviceId ? apiHandler.getItem(deviceId, 'device') : [{}],
      ]);

      $scope.rowData = requests;

      $scope.gridOptions.rowData = requests;
      $scope.gridOptions.api.setRowData();
      $scope.gridOptions.api.sizeColumnsToFit();

      $scope.device = device[0];
      $scope.$apply();
    }

    const timeReg = new RegExp('time|zeit', 'i');
    function parseField(field, val) {
      let res = '';
      switch (true) {
        case Boolean(timeReg.exec(field.field)):
          res = new Date(val);
          if (isNaN(res.getTime())) {
            res = val;
          }

          break;
        default:
          res = val;
      }
      return res;
    }

    $scope.downloadData = () => {
      const fieldsToUse = columnDefs.filter(e => e.field);
      const tableLabel = fieldsToUse.map(e => e.headerName);
      const arData = $scope.rowData.map(e => fieldsToUse.map(e1 => parseField(e1, e[e1.field])));
      const excelData = [tableLabel, ...arData];
      excelWriter.load(excelData, col, `${col}-Export`, MainModel);
    };

    $('input[name="daterange"]').daterangepicker({
      endDate,
      startDate,
      timePicker: true,
      ranges: {
        Heute: [moment().startOf('day'), moment().endOf('day')],
        Gestern: [
          moment().subtract(1, 'days').startOf('day'),
          moment().subtract(1, 'days').endOf('day'),
        ],
        'Letzte 7 Tage': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
        'Letzte 30 Tage': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
        'Diesen Monat': [moment().startOf('month'), moment().endOf('month')],
        'Letzten Monat': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month'),
        ],
      },
    }, (start, end, label) => {
      startDate = start;
      endDate = end;
      console.log(start, end, label);

      // console.log('New date range selected: ' + start.format('YYYY-MM-DD') +
      //   ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
      getState($scope).catch(console.error);
    });

    $scope.showCollection = stateManager.stateChange(MainModel.tableName);
    getState($scope).catch(console.error);
  }

  return Controller;
};

DataController.Template = html `
<div>
  <div device-view device={{device}}></div>
  <div class="row filter-row">
  <div class="col-lg-3">
    <div class="input-group">
      <span class="input-group-addon" id="basic-addon1">
        <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
      </span>
      <input type="text" class="form-control" name="daterange" placeholder="Datum (Default: Heute)">
      </div>
  </div>
  <div class='col-lg-3'>
  <button class='btn btn-success' ng-click="downloadData()">Excel-Download</button>
  </div>
    </div>
  <div class="row">
    <div ag-grid="gridOptions"  class="ag-fresh" style="height: 900px"></div>
  </div>
</div>
`;

export default DataController;
