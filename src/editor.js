import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import CodemirrorSqlMode from 'codemirror/mode/sql/sql.js';
import {GeoJSONTable} from './table.js';
import Configstore from 'configstore';
import pkg from '../package.json';

const conf = new Configstore(pkg.name);
const testCodeSample = 'SELECT * FROM ne_10m_airports';

export class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.updateCode = this.updateCode.bind(this);
		this.runCode= this.runCode.bind(this);
		this.state = {
            code: conf.get('code') || testCodeSample
        };
    }

    componentDidMount() {
		window.events.subscribe('runQuery', this.runCode);
    }

    componentWillUnmount() {
		window.events.remove('runQuery', this.runCode);
    }

    runCode() {
        this.props.db.runQuery(this.state.code, (err, result) => {
            if(err) throw err;
		    window.events.publish('displayData', result);
        })
    }

	updateCode(newCode) {
        conf.set('code', newCode);
        this.setState({
            code: newCode
        });
    }

	render() {
		const codeMirrorOptions = {
            tabSize: 2,
            lineNumbers: true,
            lineWrapping: true,
            mode: 'text/x-plsql',
            theme: 'dracula',
            //viewportMargin: Infinity
		};

		return <Codemirror value={this.state.code} onChange={this.updateCode} options={codeMirrorOptions} />;
	}
}
