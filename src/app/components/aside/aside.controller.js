/*@ngInject*/
export default class Aside {
    /**
     * @param MetroMapService {MetroMapService}
     */
    constructor(MetroMapService) {
        this._metroMapService = MetroMapService;

        this.route = MetroMapService.route;
        this.stations = MetroMapService.stations;
        this.setFocusedStep(1);
    }
    
    onChangeStep(step) {
        this._metroMapService.onChangeStep(step);
        console.log(this.route);
    }

    setFocusedStep(step) {
        this.focusedStep = step;
        this._metroMapService.focused = step;
    }
    
    calculate() {
        this._metroMapService.calculate();
    }

    get calced() {
        return this._metroMapService.calced;
    }

    showBest() {
        this._metroMapService.printMin();
    }
    showWorst() {
        this._metroMapService.printMax();
    }

}

