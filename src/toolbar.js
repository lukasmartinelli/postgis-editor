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
			  className="dark-modal"
			  overlayClassName="dark-overlay"
			  onRequestClose={this.saveConnection}
			>
			  <h1>Hi Guys! Please set the connection details</h1>
              <button onClick={this.closeEditConnectionModal}>Close Modal...</button>
		<section class="postgis-form">
        <div>
			<input type="text" placeholder="pg_hostname" value={this.state.connection.host} />
			<input type="text" placeholder="database_name" value={this.state.connection.database} />
            <input type="text" placeholder="pg_port" value={this.state.connection.port} />
			<input type="text" placeholder="pg_username" value={this.state.connection.user} />
            <input type="password" placeholder="user password" value={this.state.connection.password} />
        </div>
		</section>
              <button onClick={this.saveConnection}>Save Connection</button>
			</Modal>

		</div>;
	}
}
