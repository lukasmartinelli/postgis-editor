mapboxgl.accessToken = 'pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/morgenkaffee/cimsw88b8002l8sko6hhm2pr1',
    center: [5.9701, 46.1503],
    zoom: 9
});

map.addControl(new mapboxgl.Navigation({position: 'top-left'}));

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    mode: 'text/x-plsql',
    theme: 'dracula'
});

var cn = {
    host: '192.168.99.100',
    port: 32772,
    database: 'osm',
    user: 'osm',
    password: 'osm'
};

var randomColor = require("randomcolor");
var dbgeo = require("dbgeo");
var pgp = require('pg-promise')();
var db = pgp(cn);

function createLineLayer() {

}

function createPointLayer() {

}

function createPolygonLayer(id, source) {
    return {
        "id": id,
        "type": "fill",
        "source": source,
        "paint": {
            "fill-color": randomColor(),
            "fill-opacity": 0.8
        }
    };
}

function runAndDisplayQuery(subquery) {
    var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";
    console.log(transformQuery);
    db.any(transformQuery, true).then(function (data) {
        dbgeo.parse({
            "data": data,
            "outputFormat": "geojson",
            "geometryColumn": "geom",
            "geometryType": "geojson"
        },function(error, result) {
            if (error) {
                return console.log(error);
            }

            map.addSource("markers", {
                "type": "geojson",
                "data": result
            });

            map.addLayer(createPolygonLayer("markers_1", "markers"));
        });
    }).catch(function (error) {
        console.log(error);
    });
}

document.getElementById("run").addEventListener("click", function() {
    var query = editor.getValue();
    runAndDisplayQuery(query);
});
