import {Map} from './map.js';
import {Editor} from './editor.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import {Tabs, Pane} from './tabs.js';
import Codemirror from 'react-codemirror';

//TODO: replace with import
require('codemirror/mode/sql/sql.js');


class App extends React.Component {
	render() {
		return <div className="app">
			<ToolbarComponent />
			<Map />
			<EditorComponent />
		</div>;
	}
}

class TableRow extends React.Component {
	render() {
		return <tr>
		  <td className="result-location"><i class="fa fa-map-marker"></i></td>
		  <td>2574393997</td>
		  <td>primary</td>
		  <td>primary</td>
		  <td>false</td>
		  <td>none</td>
		</tr>;
	}
}

class Table extends React.Component {
	render() {
		return <div className="results-container">
			<table className="results-table">
			<thead>
				<tr>
				  <th></th>
				  <th>osm_id</th>
				  <th>type</th>
				  <th>class</th>
				  <th>oneway</th>
				  <th>structure</th>
				</tr>
			</thead>
			<tbody>
			<TableRow />
			<TableRow />
			<TableRow />
			<TableRow />
			<TableRow />
			</tbody>
			</table>
		</div>;
	}

}

class ToolbarComponent extends React.Component {
	render() {
		return <div className="toolbar-container">
			<button id="run" className="toolbar-button toolbar-button-primary">
				<i className="fa fa-play"></i>
				<span>Run</span>
			</button>
			<button className="toolbar-button">
				<i className="toolbar-icon fa fa-cog"></i>
				<span>Settings</span>
			</button>
		</div>;
	}
}

var testCodeSample = `
SELECT
  osm_id_geometry(osm_id, geometry) as osm_id,
  geometry,
  road_type(
    road_class(type, service, access),
    type, construction, tracktype, service
  ) AS type,
  road_class(type, service, access) AS class,
  road_oneway(oneway) AS oneway, structure
FROM road_z11
ORDER BY z_order ASC
LIMIT 2000
`;


class EditorComponent extends React.Component {
	constructor(props) {
		super(props);
		this.updateCode = this.updateCode.bind(this);
		this.state = {
            code: testCodeSample
        };
    }

	updateCode(newCode) {
        this.setState({
            code: newCode
        });
    }

	render() {
		var codeMirrorOptions = {
            lineNumbers: true,
            mode: 'text/x-plsql',
            theme: 'dracula',
            viewportMargin: Infinity
		};

		return <div className="editor-container">
			<Codemirror value={this.state.code} onChange={this.updateCode} options={codeMirrorOptions} />
            <Table />
		</div>;
	}
}

window.onload = function() {
	// Global mediator for eventing
	window.events = new Mediator();

    mapboxgl.accessToken = 'pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w';
	ReactDOM.render(
	  <App />,
	  document.getElementById('appRoot')
	);
}
