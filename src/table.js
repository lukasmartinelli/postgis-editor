import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';


export class GeoJSONTable extends React.Component {
    constructor(props) {
        super(props);
        this.populateTable = this.populateTable.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.state = {
            columns: [],
            features: []
        };
    }

    componentDidMount() {
		window.events.subscribe('displayData', this.populateTable);
    }

    componentWillUnmount() {
		window.events.remove('displayData', this.populateTable);
    }

    populateTable(result) {
        this.setState({
            features: result.geojson.features,
            columns: result.fields
                .filter(f => !isGeometry(f.name))
                .map(field => {
                    return { key: field.name, name: field.name };
                })
        });
    }

    rowGetter(i) {
        return this.state.features[i].properties;
    }

	render() {
		return <DataGrid
			columns={this.state.columns}
			rowGetter={this.rowGetter}
			rowsCount={this.state.features.length}
			minHeight={500} />;
	}
}
