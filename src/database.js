import dbgeo from "dbgeo";

var pgp = require('pg-promise')();

export class Database {

    runQuery(subquery, cb) {
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";

        //TODO: Use promises instead of callback
        //TODO: Deal with connection not set yet
        this.db.any(transformQuery, true).then((data) => {
            dbgeo.parse({
                "data": data,
                "outputFormat": "geojson",
                "geometryColumn": "geom",
                "geometryType": "geojson"
            }, cb);
        }).catch((error) => {
            console.log(error);
        });
    }

    connect(connectionOptions) {
        this.db = pgp(connectionOptions);
    }
}
