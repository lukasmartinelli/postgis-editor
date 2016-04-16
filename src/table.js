import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';
import {isGeometry} from './database.js';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import * as _ from 'lodash';

// Because we use a split window with the table on the left
// we don't have space for unlimited columns better
// limit the number since the user can click on a row
// to get the full detail on the map interface itself

// TODO: It is possible with the Grid component from react virtualized
// to create a horizontally scrollable table.
const maxColumns = 6;

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
              width={100}
		      flexGrow={1}
		      flexShrink={1}
			  cellDataGetter={(dataKey, rowData) => rowData.properties[dataKey]}
			/>
		);

		const table = (
			<AutoSizer>
    			{({ height, width }) => (
						<FlexTable
							width={width}
							height={height}
							headerHeight={30}
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
