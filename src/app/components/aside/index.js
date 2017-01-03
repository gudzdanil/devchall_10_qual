import AsideController from './aside.controller';
require('./aside.scss');

export default {
    template: require('./aside.html'),
    bindings: {},
    controller: AsideController,
    controllerAs: 'vmAside'
};