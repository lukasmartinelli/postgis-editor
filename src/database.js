import dbgeo from "dbgeo";

var pgp = require('pg-promise')();

export class Database {

    runQuery(subquery, cb) {
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";

        //TODO: Use promises instead of callback
        //TODO: Deal with connection not set yet
        this.db.result(transformQuery, true).then((result) => {
            dbgeo.parse({
                "data": result.rows,
                "outputFormat": "geojson",
                "geometryColumn": "geom",
                "geometryType": "geojson"
            }, (err, geojson) => {
		        window.events.publish('query.success', `Display ${result.rowCount} rows`);
                //TODO: This is solved some pattern somehow
                cb(err, {
                    geojson: geojson,
                    rowCount: result.rowCount,
                    fields: result.fields,
                    command: result.command,
                });
            });
        }).catch((error) => {
		    window.events.publish('query.error', error.message);
        });
    }

    connect(connectionOptions) {
        this.db = pgp(connectionOptions);
        return this.db.connect();
    }
}

export function isGeometry(fieldName) {
    return fieldName === 'geometry' || fieldName === 'geom';
}
