import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import {displayValue} from './helpers.js';
import * as _ from 'lodash';

// Because we use a split window with the table on the left
// we don't have space for unlimited columns better
// limit the number since the user can click on a row
// to get the full detail on the map interface itself

// TODO: It is possible with the Grid component from react virtualized
// to create a horizontally scrollable table.
const maxColumns = 6;

const dbType = {
    bool: 21,
    int: 23,
    bigint: 20,
    timestamp: 1114 
};

const calcWidthFromField = field => {
    if (field.dataTypeID === dbType.bool) return 25;
    if (field.dataTypeID === dbType.int) return 30;
    if (field.dataTypeID === dbType.bigint) return 55;
    if (field.dataTypeID === dbType.timestamp) return 120;
    return 150;
}

const calcFlexGrowFromField = field => {
    if (field.dataTypeID === dbType.bool) return 1;
    if (field.dataTypeID === dbType.int) return 1;
    if (field.dataTypeID === dbType.bigint) return 1;
    if (field.dataTypeID === dbType.timestamp) return 2;
    return 2;
}

export class GeoJSONTable extends React.Component {
    constructor(props) {
        super(props);
        this.populateTable = this.populateTable.bind(this);
        this.state = {
            fields: [],
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
            fields: result.fields
                .filter(f => !isGeometry(f.name))
                .slice(0, 5)
        });
    }

	render() {
		const features = this.state.features;
    	const showRowDetail = i => window.events.publish('data.detail', features[i]);
		const columns = this.state.fields.map(field =>
			<FlexColumn
              key={field.name}
			  label={field.name}
			  dataKey={field.name}
              width={calcWidthFromField(field)}
              flexGrow={calcFlexGrowFromField(field)}
			  cellDataGetter={(dataKey, rowData) => displayValue(rowData.properties[dataKey])}
			/>
		);

		const table = (
			<AutoSizer>
    			{({ height, width }) => (
						<FlexTable
							width={width}
							height={height}
							headerHeight={28}
							rowHeight={28}
							rowsCount={features.length}
							rowGetter={index => features[index]}
							onRowClick={showRowDetail}
						  >
							{columns}
						</FlexTable>
				)}
			</AutoSizer>
		);

		return features.length > 0 ? table : null;
	}
}
