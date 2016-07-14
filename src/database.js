import dbgeo from "dbgeo";
import {parser,lexer} from 'sql-parser';

var pgp = require('pg-promise')();

const errorHandler = error => window.events.publish('query.error', error.message);

export class Database {
    runQuery(subquery, cb) {
        // We can give much better error messages if we try to parse it
        // before we add our custom SQL transforms
        try {
            parser.parse(lexer.tokenize(subquery));
        } catch(error) {
            errorHandler(error);
            return;
        }

        this.transformQuery(subquery).then(({query, geomField}) => {
            return this.db.result(query, true).then((result) => {
                const parseStart = new Date().getTime();
                dbgeo.parse({
                    "data": result.rows,
                    "outputFormat": "geojson",
                    "geometryColumn": geomField.name,
                    "geometryType": "geojson"
                }, (err, geojson) => {
                    const parseEnd = new Date().getTime();
                    window.events.publish('query.success', `Queried ${result.rowCount} in ${result.duration}ms, parsed in ${parseEnd - parseStart}ms`);
                    //TODO: This is solved some pattern somehow
                    cb(err, {
                        geojson: geojson,
                        rowCount: result.rowCount,
                        fields: result.fields,
                        command: result.command,
                    });
                });
            });
        }).catch(errorHandler);
    }

    // Make a probe query requesting only one row to find the geometry field
    // and then build the actual data query
    transformQuery(query) {
        var limitQuery = `select * from (${query}) as t limit 1`;
        return this.db.result(limitQuery, true).then(result => {
            const firstGeomField = result.fields.filter(isGeometryField).shift();
            const selectClause = result.fields.map(field => {
                if(isGeometryField(field)) {
                    return `ST_AsGeoJSON(ST_Transform(${field.name}, 4326)) as ${field.name}`
                }
                return field.name;
            }).join(',');

            if(!firstGeomField) throw Error('No geometry column found in query');
            return {
                query: `SELECT ${selectClause} FROM (${query}) as t`,
                geomField: firstGeomField
            };
        });
    }

    connect(connectionOptions) {
        this.db = pgp(connectionOptions);
        return this.db.connect();
    }
}

function isGeometryField(field) {
    return (
        field.dataTypeID === 16391 ||
        field.name === 'geom' ||
        field.name === 'wkb_geometry' ||
        field.name === 'geometry'
    );
}

export function isGeometry(fieldName) {
    return fieldName === 'geometry' || fieldName === 'geom';
}
