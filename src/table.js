import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';
import * as _ from 'lodash';


export class GeoJSONTable extends React.Component {
    constructor(props) {
        super(props);
        this.populateTable = this.populateTable.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.showRowDetail = this.showRowDetail.bind(this);
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
                .slice(0, 6)
                .map(field => {
                    return { key: field.name, name: field.name };
                })
        });
    }

    showRowDetail(rows) {
		var chosenRow = rows[0];
		var feature = this.state.features[chosenRow._idx];
		window.events.publish('data.detail', feature);
    }

    rowGetter(i) {
        return _.extend({ "_idx": i }, this.state.features[i].properties);
    }

	render() {
		var grid = <DataGrid
			rowKey='_idx'
			columns={this.state.columns}
			rowGetter={this.rowGetter}
			rowsCount={this.state.features.length}
			onRowSelect={this.showRowDetail}
			enableCellSelect={true}
			enableRowSelect='single'
			minHeight={500} />;

		return this.state.features.length > 0 ? grid : null;
	}
}
