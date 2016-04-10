import React from 'react';
import ReactDOM from 'react-dom';

class TableRow extends React.Component {
	render() {
		return <tr>
		  <td className="result-location"><i class="fa fa-map-marker"></i></td>
		  <td>2574393997</td>
		  <td>primary</td>
		  <td>primary</td>
		  <td>false</td>
		  <td>none</td>
		</tr>;
	}
}

export class Table extends React.Component {
	render() {
		return <div className="results-container">
			<table className="results-table">
			<thead>
				<tr>
				  <th></th>
				  <th>osm_id</th>
				  <th>type</th>
				  <th>class</th>
				  <th>oneway</th>
				  <th>structure</th>
				</tr>
			</thead>
			<tbody>
			<TableRow />
			<TableRow />
			<TableRow />
			<TableRow />
			<TableRow />
			</tbody>
			</table>
		</div>;
	}

}
