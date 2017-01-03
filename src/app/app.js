import 'reset-css/_reset.scss';
import 'bootstrap-css';
import 'leaflet/dist/leaflet.css';
import './app.scss';

import angular from 'angular';
import angularResource from 'angular-resource';
import L from 'leaflet';

import MapService from './services/map.service';
import MetroService from './services/metro.service';
import MetroMapService from './services/metro-map.service';

import mapComponent from './components/map';
import asideComponent from './components/aside';


angular.module('devchallenge', [
        angularResource
    ])
    .constant('MAP_CONSTANTS', {
        startPointOptions: {
            color: '#00d',
            fillColor: '#00d',
            fillOpacity: .4,
            opacity: .5
        },
        endPointOptions: {
            color: '#d00',
            fillOpacity: .4,
            fillColor: '#d00',
            opacity: .5
        },
        pointRadius: 50,
        pointOptions: {
            color: '#050',
            fillColor: '#050',
            fillOpacity: .3,
            stroke: true,
            opacity: 1,
            weight: 1
        }
    })
    .factory('L', function() {
        return L;
    })
    .service('MapService', MapService)
    .service('MetroService', MetroService)
    .service('MetroMapService', MetroMapService)
    .component('map', mapComponent)
    .component('aside', asideComponent);