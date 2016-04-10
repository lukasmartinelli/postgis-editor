import React from 'react';
import ReactDOM from 'react-dom';

var dbTestConn = {
    host: '192.168.99.100',
    port: 32772,
    database: 'osm',
    user: 'osm',
    password: 'osm'
};

export class Toolbar extends React.Component {
    constructor(props) {
        super(props);
		this.runQuery = this.runQuery.bind(this);
		this.connectDatabase = this.connectDatabase.bind(this);
    }

    connectDatabase() {
        this.props.db.connect(dbTestConn);
    }

    runQuery() {
		window.events.publish('runQuery', {});
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
		</div>;
	}
}
