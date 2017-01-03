import _ from 'lodash';
/*@ngInject*/
export default class MapService {
    constructor(L, MAP_CONSTANTS) {
        this._L = L;
        this._MAP_CONSTANTS = MAP_CONSTANTS;

        this._map = null;
        this._points = [];
        this.startPoint = null;
        this.endPoint = null;
        this._ways = [];
    }

    init() {
        this._map = this._L.map('map').setView([50.447914, 30.522192], 12);
        this._createMainTile().addTo(this._map)
    }

    on(eventName, callback) {
        this._map.on(eventName, callback);
    }

    _createMainTile() {
        return this._L.tileLayer(this._MAP_CONSTANTS.url || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: this._MAP_CONSTANTS.maxZoom || 18
        });
    }

    printPoint(coord, options = {}) {
        let point = this._L.circle(coord, this._MAP_CONSTANTS.pointRadius || 10, _.assign(options, this._MAP_CONSTANTS.pointOptions));
        if(options.popupText) {
            point.bindPopup(options.popupText);
        }
        this._points.push(point);
        return point.addTo(this._map);
    }
    
    setStartPoint(coord, options = {}) {
        this.startPoint = this._setPoint(this.startPoint, coord, _.assign(options, this._MAP_CONSTANTS.startPointOptions));
    }

    setEndPoint(coord, options = {}) {
        this.endPoint = this._setPoint(this.endPoint, coord, _.assign(options, this._MAP_CONSTANTS.endPointOptions));
    }

    _setPoint(point, coord, options = {}) {
        if(point && !coord) {
            this._map.removeLayer(point);
            return null;
        }
        if(!point && coord) {
            return this._L.circleMarker(coord,  options).addTo(this._map);
        }
        if(point && coord) {
            return point.setLatLng(coord);
        }
    }

    printWay(coords, options = {}) {
        this._ways.push(this._L.polyline(coords, options).addTo(this._map));
    }

    clearAllWays() {
        for(let i = 0 ; i < this._ways.length; i++) {
            this._map.removeLayer(this._ways[i]);
        }
    }
}