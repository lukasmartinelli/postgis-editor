import * as _ from 'lodash';
import randomColor from 'randomcolor';
import React from 'react';
import ReactDOM from 'react-dom';
import {isGeometry} from './database.js';

export class Map extends React.Component {
    constructor() {
		super();
		this.displayData = this.displayData.bind(this);
        this.layers = [];
    }

	componentDidMount() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/morgenkaffee/cimsw88b8002l8sko6hhm2pr1',
            center: [5.9701, 46.1503],
            zoom: 9,
            touchZoomRotate: true,
            attributionControl: false
		});
        this.map.addControl(new mapboxgl.Navigation({ position: 'top-left' }));

		window.events.subscribe('displayData', this.displayData);
        this.map.on('click', (e) => this.displayPopup(e));
	}

    componentWillUnmount() {
        //TODO: Cleanup Mapbox event handlers
		window.events.remove('displayData', displayData);
    }

    displayData(result) {
        console.log(`Display ${result.rowCount} geometries`)
        this.recreateDebugLayers("debug_layer", "debug_source", result.geojson);
    }

	render() {
		return <div className="map-container">
			<div id="map"></div>
		</div>;
	}

    displayPopup(e) {
        var features = this.map.queryRenderedFeatures(e.point, {
            layers: this.layers
        });

        if (!features.length) {
            return;
        }

        var feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        var popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(renderDebugPopup(feature.properties))
            .addTo(this.map);
    }

    recreateDebugLayers(layerId, sourceId, result) {
        this.layers = [
            layerId + '_line',
            layerId + '_point',
            layerId + '_polygon',
        ];
        this.map.batch((batch) => {
            if (this.map.getSource(sourceId)) {
                this.map.removeSource(sourceId);
            }
            this.map.addSource(sourceId, {
                "type": "geojson",
                "data": result
            });
            createDebugLayers(batch, layerId, sourceId, randomColor());
        });
    }
}

function createDebugLayers(map, id, source, color) {
    try {
        map.removeLayer(id + "_line");
        map.removeLayer(id + "_point");
        map.removeLayer(id + "_polygon");
    } catch(err) {
        //Layer don't exist yet
    }

    map.addLayer(createLineLayer(id + "_line", source, color));
    map.addLayer(createPointLayer(id + "_point", source, color));
    map.addLayer(createPolygonLayer(id + "_polygon", source, color));
};

function createLineLayer(id, source, color) {
    return {
        "id": id,
        "type": "line",
        "source": source,
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": 2
        },
        "filter": ["all", ["==", "$type", "LineString" ]]
    };
}

function createPointLayer(id, source, color) {
    return {
        "id": id,
        "type": "circle",
        "source": source,
        "paint": {
            "circle-radius": 2,
            "circle-color": color,
        },
        "filter": ["all", ["==", "$type", "Point" ]]
    };
}

function createPolygonLayer(id, source, color) {
    return {
        "id": id,
        "type": "fill",
        "source": source,
        "paint": {
            "fill-color": color,
            "fill-opacity": 0.8
        },
        "filter": ["all", ["==", "$type", "Polygon" ]]
    };
}

function properties(object) {
    let arr = [];
	for (var key in object) {
        arr.push({ key, value: object[key] });
    }
    return arr;
}

function renderDebugPopup(props) {
    var rows = properties(props).filter(p => !isGeometry(p.key)).map(prop => {
        return `
		    <tr class="debug-prop">
                <td class="debug-prop-key">${prop.key}</td>
                <td class="debug-prop-value">${prop.value}</td>
            </tr>
        `;
    }).join('');
    return `<table class="debug-props">${rows}</table>`
}
