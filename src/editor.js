import React from 'react';
import ReactDOM from 'react-dom';
import Codemirror from 'react-codemirror';
import CodemirrorSqlMode from 'codemirror/mode/sql/sql.js';
import {GeoJSONTable} from './table.js';
import Configstore from 'configstore';
import pkg from '../package.json';

const conf = new Configstore(pkg.name);
const testCodeSample = `
SELECT
  osm_id_geometry(osm_id, geometry) as osm_id,
  geometry,
  road_type(
    road_class(type, service, access),
    type, construction, tracktype, service
  ) AS type,
  road_class(type, service, access) AS class,
  road_oneway(oneway) AS oneway, structure
FROM road_z11
ORDER BY z_order ASC
LIMIT 2000
`;

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
            lineNumbers: true,
            mode: 'text/x-plsql',
            theme: 'dracula',
            viewportMargin: Infinity
		};

		return <Codemirror value={this.state.code} onChange={this.updateCode} options={codeMirrorOptions} />;
	}
}
