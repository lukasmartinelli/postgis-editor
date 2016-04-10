import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from 'react-data-grid';


var _rows = [];
for (var i = 1; i < 1000; i++) {
  _rows.push({
    id: i,
    title: 'Title ' + i,
    count: i * 1000
  });
}

//A rowGetter function is required by the grid to retrieve a row for a given index
var rowGetter = function(i){
  return _rows[i];
};


var columns = [
{
  key: 'id',
  name: 'ID'
},
{
  key: 'title',
  name: 'Title'
},
{
  key: 'count',
  name: 'Count'
}
]

export class Table extends React.Component {
	render() {
		return <DataGrid
			columns={columns}
			rowGetter={rowGetter}
			rowsCount={_rows.length}
			minHeight={500} />;
	}
}
