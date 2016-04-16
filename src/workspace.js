import {Editor} from './editor.js';
import {Toolbar} from './toolbar.js';
import {Database} from './database.js';
import {GeoJSONTable} from './table.js';
import React from 'react';


export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.displayQuerySuccessMessage = this.displayQuerySuccessMessage.bind(this);
        this.displayQueryErrorMessage = this.displayQueryErrorMessage.bind(this);

        this.db = new Database();
        this.state = {
            errorMessage: null,
            message: null
        };
    }

    displayQuerySuccessMessage(msg) {
        this.setState({
            errorMessage: null,
            message: msg
        });
    }

    displayQueryErrorMessage(msg) {
        this.setState({
            errorMessage: msg
        });
    }

    componentDidMount() {
		window.events.subscribe('query.error', this.displayQueryErrorMessage);
		window.events.subscribe('query.success', this.displayQuerySuccessMessage);
    }

    componentWillUnmount() {
		window.events.remove('query.error', this.displayQueryErrorMessage);
		window.events.remove('query.success', this.displayQuerySuccessMessage);
    }

	render() {
        var workspaceError = null;
        if(this.state.errorMessage) {
            workspaceError = <div className="workspace-error">
                               {this.state.errorMessage}
                             </div>;
        }

		return <div className="workspace">
            <div className="workspace-header">
                <Toolbar db={this.db} />
            </div>
            {workspaceError}
            <div className="workspace-editor">
                <Editor db={this.db} />
            </div>
            <div className="workspace-table">
                <GeoJSONTable />
            </div>
            <div className="workspace-logs">
                {this.state.message}
            </div>
        </div>;
	}
}
