function devicePanel() {
  return {
    template: html `
    <div class="well" ng-style="device.id ? {'border-color': 'green'} : {'border-color': 'grey'}">
    <div data-bind="foreach: device.data" ng-visible='device'>
      <div>
        <strong>Geräte ID: </strong> <span data-bind="text: _id">{{device.id}}</span>
      </div>
      <div>
        <strong>Standort: </strong><span data-bind="text: location">{{device.location}}</span>
      </div>
      <div>
        <strong>Kunde: </strong><span data-bind="text: customer">{{device.customer}}</span>
      </div>
    </div>
    </div>
    `,
  };
}

export default {
  devicePanel,
};
