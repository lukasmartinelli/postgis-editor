import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import * as _ from 'lodash';

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
            fields: result.fields.filter(f => !isGeometry(f.name))
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
		      flexGrow={1}
			  minWidth={150}
			  cellDataGetter={(dataKey, rowData) => rowData.properties[dataKey]}
			/>	
		);

		const table = (
			<AutoSizer>
    			{({ height, width }) => (
						<FlexTable
							width={width}
							height={height}
							headerHeight={20}
							rowHeight={30}
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
