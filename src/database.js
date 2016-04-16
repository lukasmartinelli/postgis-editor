import dbgeo from "dbgeo";
import {parser,lexer} from 'sql-parser';

var pgp = require('pg-promise')();

const errorHandler = error => window.events.publish('query.error', error.message);

export class Database {
    runQuery(subquery, cb) {
        // We can give much better error messages if we try to parse it
        // before we add our custom SQL transforms
        try {
            var ast = parser.parse(lexer.tokenize(subquery));
        } catch(error) {
            errorHandler(error);
            return;
        }

        //TODO: Use promises instead of callback
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";
        this.db.result(transformQuery, true).then((result) => {
            dbgeo.parse({
                "data": result.rows,
                "outputFormat": "geojson",
                "geometryColumn": "geom",
                "geometryType": "geojson"
            }, (err, geojson) => {
                console.log(result);
		        window.events.publish('query.success', `${result.rowCount} rows in ${result.duration}ms`);
                //TODO: This is solved some pattern somehow
                cb(err, {
                    geojson: geojson,
                    rowCount: result.rowCount,
                    fields: result.fields,
                    command: result.command,
                });
            });
        }).catch(errorHandler);
    }

    connect(connectionOptions) {
        this.db = pgp(connectionOptions);
        return this.db.connect();
    }
}

export function isGeometry(fieldName) {
    return fieldName === 'geometry' || fieldName === 'geom';
}
