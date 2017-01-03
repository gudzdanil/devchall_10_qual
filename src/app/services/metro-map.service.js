import _ from 'lodash';

/*@ngInject*/
export default class MetroMapService {
    /**
     * @param MetroService {MetroService}
     * @param MapService {MapService}
     * @param $document {jqLite}
     */
    constructor(MetroService, MapService, $document, $rootScope) {
        this._metroService = MetroService;
        this._mapService = MapService;
        this._document = $document;
        this._scope = $rootScope;

        this._stations = [];
        this.route = {
            from: null,
            to: null
        };

        this.minRoute = [];
        this.maxRoute = [];

        this.minRouteOptions = {
            color: '#0a0',
            weight: 3,
            opacity: 1
        };
        this.maxRouteOptions = {
            color: '#d00',
            weight: 3,
            opacity: 1
        };

        this.calced = false;
        this.focused = false;
    }

    get step() {
        return ~~!!this.route.from + ~~!!this.route.to;
    }
    
    init() {
        this._stations.splice(0, this._stations.length);
        this._initStations().then(_.bind(this._onStations, this));
        this._mapService.init();
        this._mapService.on('click', _.bind(this._onMapPointSelect, this))
    }

    onChangeStep(step) {
        switch (step) {
            case 1:
                this._mapService.setStartPoint(this._metroService.getStationCoordsById(this.route.from.id));
                break;
            case 2:
                this._mapService.setEndPoint(this._metroService.getStationCoordsById(this.route.to.id));
                break;
        }
    }

    _onMapPointSelect(e) {
        if(!this.focused) {
            return;
        }
        this.route[this.focused === 1 ? 'from' : 'to'] = this._metroService.findNearestStation(e.latlng);
        this.onChangeStep(this.focused);
        this._scope.$digest();
    }

    _onStations(stations) {
        this._stations.push.apply(this._stations, stations);
        this._printAll(this._metroService.getStationsCoords());
    }

    _initStations() {
        return this._metroService.getStations().then(_.bind(this._onStations, this));
    }

    get stations() {
        return this._stations;
    }

    _printAll(stations) {
        _.each(stations || this._stations, (station) => {
            this._mapService.printPoint(station.coord, {popupText: station.name});
        });
    }

    calculate() {
        if(this.route.from && this.route.to && this.route.from !== this.route.to) {
            this.calced = this.route.from.name + ' - ' + this.route.to.name;
            let ways = this._metroService.getWays(this.route.from.id, this.route.to.id, [[]]);
            let distances = this._metroService.calcWaysLength(ways);
            console.log(ways, distances);
            let minDist = Math.min.apply(Math, _.map(distances, d => d.distance));
            let maxDist = Math.max.apply(Math, _.map(distances, d => d.distance));
            this.minRoute = _.map(ways[_.find(distances, d => minDist === d.distance).index], (id) => this._metroService.getStationCoordsById(id));
            this.maxRoute = _.map(ways[_.find(distances, d => maxDist === d.distance).index], (id) => this._metroService.getStationCoordsById(id));
        }
    }

    printMin() {
        let calced = this.calced;
        this._clear();
        this._mapService.printWay(this.minRoute, this.minRouteOptions);
        this.calced = calced;
    }

    printMax() {
        let calced = this.calced;
        this._clear();
        this._mapService.printWay(this.maxRoute, this.maxRouteOptions);
        this.calced = calced;
    }

    _clear() {
        this._mapService.clearAllWays();
        this.calced = false;
    }
}
