import React from 'react';
import ReactDOM from 'react-dom';

export class Toolbar extends React.Component {
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
