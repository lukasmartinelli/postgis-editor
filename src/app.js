import {Map} from './map.js';
import {Editor} from './editor.js';
import {Toolbar} from './toolbar.js';
import {Database} from './database.js';
import {Workspace} from './workspace.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Mediator} from 'mediator-js';
import Modal from 'react-modal';
import Codemirror from 'react-codemirror';

class App extends React.Component {
    constructor() {
        super();
        this.closeErrorModal = this.closeErrorModal.bind(this);
        this.displayError = this.displayError.bind(this);
        this.state = {
            errorMessage: '',
            showError: false
        };
    }

    displayError(message) {
        this.setState({
            errorMessage: message,
            showErrorModal: true
        });
    }

    componentDidMount() {
        window.onerror +=  this.displayError;
		window.events.subscribe('error', this.displayError);
    }

    componentWillUnmount() {
        window.onerror -=  this.displayError;
		window.events.remove('error', this.displayError);
    }

    closeErrorModal() {
        this.setState({
            showErrorModal: false
        });
    }

	render() {
		return <div className="app">
            <div className="layout-left">
                <Workspace />
            </div>
            <div className="layout-right">
                <Map />
            </div>
			<Modal
			  isOpen={this.state.showErrorModal}
			  className="modal"
			  overlayClassName="modal-overlay"
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
