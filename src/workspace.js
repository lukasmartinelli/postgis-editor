import {Editor} from './editor.js';
import {Toolbar} from './toolbar.js';
import {Database} from './database.js';
import React from 'react';

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.db = new Database();
    }

	render() {
		return <div className="workspace">
            <div className="workspace-header">
                <Toolbar db={this.db} />
            </div>
		    <div className="workspace-editor">
                <Editor db={this.db} />
            </div>
        </div>;
	}
}
