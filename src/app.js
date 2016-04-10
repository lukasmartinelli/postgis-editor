import {Map} from './map.js';
import {Editor, Database} from './editor.js';
import {Toolbar} from './toolbar.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import Codemirror from 'react-codemirror';


class App extends React.Component {
	render() {
		return <div className="app">
			<Toolbar />
			<Map />
			<Editor />
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
