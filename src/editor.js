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
    theme: 'dracula',
	viewportMargin: Infinity
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

function createLineLayer(id, source) {
	return {
		"id": id,
        "type": "line",
        "source": source,
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": randomColor(),
            "line-width": 2
        },
		"filter": [	"all", ["==", "$type", "LineString" ]]
	};
}

function createPointLayer(id, source) {
	return {
        "id": id,
        "type": "circle",
        "source": source,
        "paint": {
            "circle-radius": 2,
            "circle-color": randomColor(),
        },
		"filter": [	"all", ["==", "$type", "Point" ]]
    };
}

function createPolygonLayer(id, source) {
    return {
        "id": id,
        "type": "fill",
        "source": source,
        "paint": {
            "fill-color": randomColor(),
            "fill-opacity": 0.8
        },
		"filter": [	"all", ["==", "$type", "Polygon" ]]
    };
}

function createDebugLayers(map, id, source) {
	try {
		map.removeLayer(id + "_line");
		map.removeLayer(id + "_point");
		map.removeLayer(id + "_polygon");
	} catch(err) {
		//Layer don't exist yet
	}

    layerBelow = 'water';
	map.addLayer(createLineLayer(id + "_line", source), layerBelow);
	map.addLayer(createPointLayer(id + "_point", source), layerBelow);
	map.addLayer(createPolygonLayer(id + "_polygon", source), layerBelow);
};

var layers = [];
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

			map.batch(function(batch) {
				var sourceId = "query";
				layers.forEach(function(i, l) {
					map.removeSource(sourceId);
				});
				layers = [];
				map.addSource("query", {
					"type": "geojson",
					"data": result
				});
				layers.push(sourceId);
				createDebugLayers(batch, "debug", sourceId);
			});
        });
    }).catch(function (error) {
        console.log(error);
    });
}

document.getElementById("run").addEventListener("click", function() {
    var query = editor.getValue();
    runAndDisplayQuery(query);
});

function renderDebugPopup(props) {
	var html = '<table class="debug-props">';
	for (var key in props) {
		html += '<tr class="debug-prop">';
		html += '<td class="debug-prop-key">';
		html += key;
		html += '</td>';
		html += '<td class="debug-prop-value">';
		html += props[key];
		html += '</td>';
		html += '</tr>';
	}
	html += '</div>';
	return html;
}

// When a click event occurs near a marker icon, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['debug_line'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(renderDebugPopup(feature.properties))
        .addTo(map);
});
