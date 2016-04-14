import dbgeo from "dbgeo";

var pgp = require('pg-promise')();

export class Database {

    runQuery(subquery, cb) {
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry, t.* from (" + subquery + ") as t";

        //TODO: Use promises instead of callback
        //TODO: Deal with connection not set yet
        this.db.result(transformQuery, true).then((result) => {
            dbgeo.parse({
                "data": result.rows,
                "outputFormat": "geojson",
                "geometryColumn": "geometry",
                "geometryType": "geojson"
            }, (err, geojson) => {
                //TODO: This is solved some pattern somehow
                cb(err, {
                    geojson: geojson,
                    rowCount: result.rowCount,
                    fields: result.fields,
                    command: result.command,
                });
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    connect(connectionOptions) {
        this.db = pgp(connectionOptions);
    }
}

export function isGeometry(fieldName) {
    return fieldName === 'geometry' || fieldName === 'geom';
}
