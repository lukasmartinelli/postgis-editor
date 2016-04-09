import {Map} from './map.js';
import {Editor} from './editor.js';

window.onload = function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w';
    var map = new Map({ container: 'map' });
    var editor = new Editor(map);
}
