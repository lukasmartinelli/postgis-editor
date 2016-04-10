import {Map} from './map.js';
import {Editor} from './editor.js';
import {Toolbar} from './toolbar.js';
import {Database} from './database.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import Codemirror from 'react-codemirror';


class App extends React.Component {
    constructor() {
        super();
        this.db = new Database();
    }

	render() {
		return <div className="app">
			<Toolbar db={this.db} />
			<Map />
			<Editor db={this.db} />
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
