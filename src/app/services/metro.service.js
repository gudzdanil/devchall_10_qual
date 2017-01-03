import _ from 'lodash';

/*@ngInject*/
class MetroService {
    constructor($http, L) {
        this._http = $http;
        this._stations = [];
        this._stationsDict = {};
        this._L = L;
        this._promise = null;
        this._stationNames = [];

        this._initStations();
    }

    _initStations() {
        this._promise = this._http.get('./data/stations.json').then(
            res => {
                this._stations = res.data;
                this._stationNames = _.map(
                    this._stations,
                    s => {
                        this._stationsDict[s.id] = s;
                        return _.pick(s, ['name', 'id'])
                    }
                );
                return this._stationNames;
            }
        );
    }

    getWays(cur, to, ways) {
        let station = this._stationsDict[cur];
        let curWay = ways[ways.length - 1];
        curWay.push(cur);
        let canGoTo = _.filter(station.connections, (c) => !_.find(curWay, (w) => w === c));
        ways.pop();
        for (let i = 0; i < canGoTo.length; i++) {
            ways.push(_.clone(curWay));
            if (canGoTo[i] === to) {
                ways[ways.length - 1].push(to);
                return ways;
            }
            this.getWays(canGoTo[i], to, ways);
        }
        return ways;
    }

    getStations() {
        return this._promise;
    }

    getStationsCoords() {
        return _.map(this._stations, s => _.pick(s, ['id', 'coord', 'name']));
    }

    getStationCoordsById(id) {
        return this.getStationById(id).coord;
    }

    getStationById(id) {
        return this._stationsDict[id];
    }

    calcWaysLength(ways) {
        let distances = [];
        for(let i = 0 ; i < ways.length; i++) {
            let way = ways[i];
            let dist = 0;
            for(let j = 0; j < way.length - 1; j++) {
                dist += this._L.latLng(this._stationsDict[way[j]].coord).distanceTo(this._stationsDict[way[j+1]].coord);
            }
            distances.push({
                distance: dist,
                index: i
            });
        }
        return distances;
    }

    findNearestStation(latlng) {
        latlng = this._L.latLng(latlng);
        let min = Number.POSITIVE_INFINITY;
        let minInd = -1;
        for(let i = 0 ; i < this._stations.length; i++) {
            let dist = latlng.distanceTo(this._L.latLng(this._stations[i].coord));
            if(dist < min) {
                min = dist;
                minInd = i;
            }
        }
        return minInd > -1 && this._stationNames[minInd];
    }
}

export default MetroService;