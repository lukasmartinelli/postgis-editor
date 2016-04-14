import {Map} from './map.js';
import {Editor} from './editor.js';
import {Toolbar} from './toolbar.js';
import {Database} from './database.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import Modal from 'react-modal';
import Codemirror from 'react-codemirror';
require('mapbox-gl');

class App extends React.Component {
    constructor() {
        super();
        this.db = new Database();
        this.closeErrorModal = this.closeErrorModal.bind(this);
        this.state = {
            errorMessage: '',
            showError: false
        };
    }

    componentDidMount() {
        var self = this;
        window.onerror = function(message, source, lineno, colno, error) {
		    self.setState({
                errorMessage: message,
                showErrorModal: true
            });
        }
    }

    closeErrorModal() {
        this.setState({
            showErrorModal: false
        });
    }

	render() {
		return <div className="app">
			<Toolbar db={this.db} />
			<Map />
			<Editor db={this.db} />
			<Modal
			  isOpen={this.state.showErrorModal}
			  className="dark-modal"
			  overlayClassName="dark-overlay"
			>
			  <p>{this.state.errorMessage}</p>
              <button onClick={this.closeErrorModal}>Close Modal...</button>
			</Modal>
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
