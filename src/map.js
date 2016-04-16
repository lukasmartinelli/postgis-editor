import * as _ from 'lodash';
import randomColor from 'randomcolor';
import React from 'react';
import ReactDOM from 'react-dom';
import turf from 'turf';
import {isGeometry} from './database.js';
import {displayValue} from './helpers.js';

export class Map extends React.Component {
    constructor() {
		super();
		this.displayData = this.displayData.bind(this);
		this.displayPopup = this.displayPopup.bind(this);
		this.displayFeaturePopup = this.displayFeaturePopup.bind(this);
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
		window.events.subscribe('data.detail', this.displayFeaturePopup);
        this.map.on('click', (e) => this.displayPopup(e));
	}

    componentWillUnmount() {
        // As map DOM object is destroyed the Mapbox event handlers will be removed as well
		window.events.remove('displayData', this.displayData);
		window.events.remove('data.detail', this.displayFeaturePopup);
    }

    displayData(result) {
        this.recreateDebugLayers("debug_layer", "debug_source", result.geojson);
        //TODO: Fly to location of points
    }

	render() {
		return <div id="map"></div>;
	}

	displayFeaturePopup(feature) {
		var labelCoords = turf.pointOnSurface(feature.geometry).geometry.coordinates;

        // Clear all previous map popups
        if(this.popup) {
            this.popup.remove();
        }

        this.popup = new mapboxgl.Popup()
            .setLngLat(mapboxgl.LngLat.convert(labelCoords))
            .setHTML(renderFeaturePropertyTable(feature))
            .addTo(this.map);

		this.map.flyTo({center: labelCoords, zoom: 13});
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
            .setHTML(renderFeaturePropertyTable(feature))
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

class FeaturePropertyTable extends React.Component {
    items(object) {
        let arr = [];
        for (var key in object) {
            arr.push({ key, value: object[key] });
        }
        return arr;
    }

	render() {
        const rows = this.items(this.props.feature.properties)
            .filter(i => !isGeometry(i.key))
            .map(i => {
                return <tr key={i.key} className="debug-prop">
                    <td className="debug-prop-key">{i.key}</td>
                    <td className="debug-prop-value">{displayValue(i.value)}</td>
                </tr>; 
            });
		return <table className="debug-props"><tbody>{rows}</tbody></table>;;
	}
}

function renderFeaturePropertyTable(feature) {
    var mountNode = document.createElement('div');
    ReactDOM.render(<FeaturePropertyTable feature={feature} />, mountNode);
    return mountNode.innerHTML;
}
