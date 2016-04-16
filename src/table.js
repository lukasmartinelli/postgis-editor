import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';
import JsonTable from 'react-json-table';
import * as _ from 'lodash';

// Even though huge tables are fun it does not make any sense
// to query a million rows and scroll through all of them
// therefore we make our life easy by limiting the displayed rows
const maxRows = 1000;

// Because we use a split window with the table on the left
// we don't have space for unlimited columns better
// limit the number since the user can click on a row
// to get the full detail on the map interface itself
const maxColumns = 6;

export class GeoJSONTable extends React.Component {
    constructor(props) {
        super(props);
        this.populateTable = this.populateTable.bind(this);
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
            features: result.geojson.features.slice(0, maxRows).map(f => {
				return _.extend({ _feature: f }, f.properties);
			}),
            columns: result.fields
                .filter(f => !isGeometry(f.name))
                .slice(0, maxColumns)
                .map(field => {
                    return {
						key: field.name,
						label: field.name
					};
                })
        });
    }

    showRowDetail(e, row) {
		window.events.publish('data.detail', row._feature);
    }

	render() {
		const table = <JsonTable
			rows={this.state.features}
			columns={this.state.columns}
			onClickRow={this.showRowDetail} />;

		return this.state.features.length > 0 ? table : null;
	}
}
