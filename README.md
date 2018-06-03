# PostGIS Query Editor [![Linux Build Status](https://travis-ci.org/lukasmartinelli/postgis-editor.svg?branch=master)](https://travis-ci.org/lukasmartinelli/postgis-editor) [![Windows Build status](https://ci.appveyor.com/api/projects/status/a90g1nkv2a792w98?svg=true)](https://ci.appveyor.com/project/lukasmartinelli/postgis-editor) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://tldrlegal.com/license/mit-license)

> :warning: This repository is no longer maintained by Lukas Martinelli.

A very accessible **PostGIS query editor** and visualizer.
Getting started with [PostGIS](http://postgis.net/) is harder than it should be. We spent much time in **psql** and wished to visualize
our queries quickly without big complicated tools.

**Features:**
- Just type your query - we try to figure out the geometry/projection
- Beautiful MapboxGL based visualization
- Click on any feature for full information
- Table view to jump to important features
- Display 100k objects with ease
- Cross platform support for Windows, OSX and Linux

![Demo video](demo.gif)

## Install

[**Download the app for your platform from the releases page**](https://github.com/lukasmartinelli/postgis-editor/releases/latest).

Now unzip the release and either execute **postgis-editor.app** for OSX, **postgis-editor.exe** for Windows or **postgis-editor** for Linux.

If this project gains traction we can start building installers for Windows and create packages for different Linux distros. You can also clone the repo
and run **postgis-editor** directly with npm.

## Introduction

Video introduction into using PostGIS editor with Natural Earth data.

**https://www.youtube.com/watch?v=NSIUAca_DEU**

[![Using PostGIS Editor to explore Natural Earth ](https://img.youtube.com/vi/NSIUAca_DEU/0.jpg)](https://www.youtube.com/watch?v=NSIUAca_DEU)

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
npm run package-all
```

The cross platform artifacts on the release page are automatically build by either Travis (for OSX and Linux) and by AppVeyor (for Windows).
