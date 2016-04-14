import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

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
		this.saveConnection = this.saveConnection.bind(this);
		this.showEditConnectionModal = this.showEditConnectionModal.bind(this);
		this.closeEditConnectionModal = this.closeEditConnectionModal.bind(this);
		this.state = {
            enableRun: false,
			editConnection: false,
			connection: {
                host: '192.168.99.100',
                port: 32769,
                database: 'osm',
                user: 'osm',
                password: 'osm'
			}
		};
    }

    showEditConnectionModal() {
		this.setState({editConnection: true});
    }

    closeEditConnectionModal() {
		this.setState({editConnection: false});
    }

    runQuery() {
		window.events.publish('runQuery', {});
    }

    saveConnection() {
		//TODO: Find better name for editConnection
		this.setState({
            enableRun: true,
            editConnection: false
        });
        this.props.db.connect(this.state.connection);
        console.log('Connected', this.state.connection);
    }

	render() {
        var runButtonClassName = "toolbar-button ";
        if (this.state.enableRun === true) {
            runButtonClassName += "toolbar-button-primary";
        }

		return <div className="toolbar-container">
			<button onClick={this.runQuery} className={runButtonClassName}>
				<i className="fa fa-play"></i>
				<span>Run</span>
			</button>
			<button onClick={this.showEditConnectionModal} className="toolbar-button">
				<i className="toolbar-icon fa fa-database"></i>
				<span>Connect</span>
			</button>

			<Modal
			  isOpen={this.state.editConnection}
			  className="modal"
			  overlayClassName="modal-overlay"
			  onRequestClose={this.saveConnection}
			>
			  <h3 className="modal-title">Connect to PostGIS database
                <i className="fa fa-close modal-close" onClick={this.closeEditConnectionModal}></i>
              </h3>
        <section className="modal-content">
            <div className="config-field">
                <input type="text" placeholder="hostname" value={this.state.connection.host} />
                <label className="config-label">host</label>
            </div>
            <div className="config-field">
                <input type="text" placeholder="port" value={this.state.connection.port} />
                <label className="config-label">port</label>
            </div>
            <div className="config-field">
                <input type="text" placeholder="username" value={this.state.connection.user} />
                <label className="config-label">user</label>
            </div>
            <div className="config-field">
                <input type="password" placeholder="password" value={this.state.connection.password} />
                <label className="config-label">pass</label>
            </div>
            <div className="config-field">
                <input type="text" placeholder="database name" value={this.state.connection.database} />
                <label className="config-label">db</label>
            </div>
            <button className="modal-confirm" onClick={this.saveConnection}>Save Connection</button>
        </section>
			</Modal>

		</div>;
	}
}
