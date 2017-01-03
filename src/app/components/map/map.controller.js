/*@ngInject*/
export default class MapController {
    constructor(MetroMapService) {
        this._metroMapService = MetroMapService;
        MetroMapService.init();
    }
}