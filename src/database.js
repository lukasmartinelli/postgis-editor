import dbgeo from "dbgeo";
import * as _ from 'lodash';

var pgp = require('pg-promise')();

export class Database {
    constructor(connectionOptions) {
        this.db = pgp(_.extend(connectionOptions, {
            host: '192.168.99.100',
            port: 32772,
            database: 'osm',
            user: 'osm',
            password: 'osm'
        }));
    }

    runAndDisplayQuery(subquery) {
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";

        this.db.any(transformQuery, true).then((data) => {
            dbgeo.parse({
                "data": data,
                "outputFormat": "geojson",
                "geometryColumn": "geom",
                "geometryType": "geojson"
            }, (error, result) => {
                if (error) {
                    return console.log(error);
                }

                this.map.recreateDebugLayers('layer_query1', 'source_query1', result);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

}
