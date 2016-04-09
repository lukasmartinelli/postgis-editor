import dbgeo from "dbgeo";

var pgp = require('pg-promise')();

export class Editor {
    constructor(map) {
        this.map = map;
        var cn = {
            host: '192.168.99.100',
            port: 32772,
            database: 'osm',
            user: 'osm',
            password: 'osm'
        };

        this.db = pgp(cn);
        this.codeMirror = CodeMirror.fromTextArea(document.getElementById('editor'), {
            lineNumbers: true,
            mode: 'text/x-plsql',
            theme: 'dracula',
            viewportMargin: Infinity
        });

        document.getElementById("run").addEventListener("click", () => {
            var query = this.codeMirror.getValue();
            this.runAndDisplayQuery(query);
        });
    }

    runAndDisplayQuery(subquery) {
        var transformQuery = "select ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geom, t.* from (" + subquery + ") as t";
        var self = this;

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
