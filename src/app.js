import {Map} from './map.js';
import {Editor, Database} from './editor.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import Codemirror from 'react-codemirror';

//TODO: replace with import
require('codemirror/mode/sql/sql.js');


class App extends React.Component {
	render() {
		return <div className="app">
			<ToolbarComponent />
			<Map />
			<Editor />
		</div>;
	}
}

class ToolbarComponent extends React.Component {
    constructor() {
        super();
		this.runQuery = this.runQuery.bind(this);
    }

    runQuery() {
       console.log('Yaay I got clicked');
    }

	render() {
		return <div className="toolbar-container">
			<button onClick={this.runQuery} className="toolbar-button toolbar-button-primary">
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

window.onload = function() {
	// Global mediator for eventing
	window.events = new Mediator();

    mapboxgl.accessToken = 'pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w';
	ReactDOM.render(
	  <App />,
	  document.getElementById('appRoot')
	);
}
