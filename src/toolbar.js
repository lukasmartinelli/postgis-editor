import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

var dbTestConn = {
    host: '192.168.99.100',
    port: 32772,
    database: 'osm',
    user: 'osm',
    password: 'osm'
};

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


export class Toolbar extends React.Component {
    constructor(props) {
        super(props);
		this.runQuery = this.runQuery.bind(this);
		this.saveConnection = this.saveConnection(this);
		this.connectDatabase = this.connectDatabase.bind(this);
		this.state = {
			editConnection: false
		};
    }

    connectDatabase() {
		this.setState({editConnection: true});
        this.props.db.connect(dbTestConn);
    }

    runQuery() {
		window.events.publish('runQuery', {});
    }

    saveConnection() {
		//TODO: Find better name for editConnection
		this.setState({editConnection: false});
    }

	render() {
		return <div className="toolbar-container">
			<button onClick={this.runQuery} className="toolbar-button toolbar-button-primary">
				<i className="fa fa-play"></i>
				<span>Run</span>
			</button>
			<button onClick={this.connectDatabase} className="toolbar-button">
				<i className="toolbar-icon fa fa-database"></i>
				<span>Connect</span>
			</button>
			<Modal
			  isOpen={this.state.editConnection}
			  className="dark-modal"
			  overlayClassName="dark-overlay"
			  onRequestClose={this.saveConnection}
			>
			  <h1>Hi Guys! Please set the connection details</h1>
			</Modal>

		</div>;
	}
}
