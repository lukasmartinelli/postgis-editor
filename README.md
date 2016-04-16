# PostGIS Query Editor

A very accessible **PostGIS query editor** and visualizer.
Getting started with [PostGIS](http://postgis.net/) is harder than it should be. We spent much time in **psql** and wished to visualize
our queries quickly without big complicated tools.

**Features:**
- Just type your query - we try to figure out the geometry/projection
- Beautiful MapboxGL based visualization
- Click on any feature for full information
- Table view to jump to important features
- Display 100k objects with ease

![Demo video](demo.gif)

## Install

**The installation builds are still experimental**

Download the app for your platform from the [releases page](https://github.com/lukasmartinelli/postgis-editor/releases/latest).

## Develop

The PostGIS query editor is based on Electron using React and MapboxGL.
Install node dependencies and generate `dist`.

```bash
npm install
npm run build
```

Run Electron app.

```bash
npm start
```

Create releases.

```bash
npm run package
```
