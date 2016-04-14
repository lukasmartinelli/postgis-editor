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

		this.hostChanged = this.hostChanged.bind(this);
		this.portChanged = this.portChanged.bind(this);
		this.userChanged = this.userChanged.bind(this);
		this.passwordChanged = this.passwordChanged.bind(this);
		this.dbChanged = this.dbChanged.bind(this);


		this.state = {
            enableRun: false,
			editConnection: false,
            host: '192.168.99.100',
            port: 32769,
            database: 'osm',
            user: 'osm',
            password: 'osm'
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
        var connOpts = {
            host: this.state.host,
            port: this.state.port,
            database: this.state.database,
            user: this.state.user,
            password: this.state.password,
        };

        this.props.db.connect(connOpts).then(obj => {
            obj.done(); // success, release connection;
            console.log('Connected', connOpts);
            this.setState({
                enableRun: true,
                editConnection: false,
                errorMsg: null
            });
        }).catch(error => {
            this.setState({
                errorMsg: error.message
            });
        });
    }

    hostChanged(event) {
        this.setState({host: event.target.value});
    }

    portChanged(event) {
        this.setState({port: event.target.value});
    }

    userChanged(event) {
        this.setState({user: event.target.value});
    }

    passwordChanged(event) {
        this.setState({password: event.target.value});
    }

    dbChanged(event) {
        this.setState({database: event.target.value});
    }

	render() {
        var errorClass = this.state.errorMsg ? 'modal-error' : '';
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
                    <input type="text" placeholder="hostname" value={this.state.host} onChange={this.hostChanged} />
                    <label className="config-label">host</label>
                </div>
                <div className="config-field">
                    <input type="text" placeholder="port" value={this.state.port} onChange={this.portChanged} />
                    <label className="config-label">port</label>
                </div>
                <div className="config-field">
                    <input type="text" placeholder="username" value={this.state.user} onChange={this.userChanged} />
                    <label className="config-label">user</label>
                </div>
                <div className="config-field">
                    <input type="password" placeholder="password" value={this.state.password} onChange={this.passwordChanged} />
                    <label className="config-label">pass</label>
                </div>
                <div className="config-field">
                    <input type="text" placeholder="database name" value={this.state.database} onChange={this.dbChanged} />
                    <label className="config-label">db</label>
                </div>
                <div className={errorClass}>{this.state.errorMsg}</div>
                <button className="modal-confirm" onClick={this.saveConnection}>Save Connection</button>
              </section>
			</Modal>

		</div>;
	}
}
