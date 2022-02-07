import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
const pkg = require('./package.json');

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n * */`;

let outro = pkg.name + ' v' + pkg.version;

outro = `typeof console !== 'undefined' && console.log('${outro}');`;

const intro = '';

const basePlugins = [
    json()
];

module.exports = [
    {
        input: 'src/index.js',
        plugins: basePlugins,
        external: [],
        output: {
            'sourcemap': true,
            'format': 'umd',
            'name': 'gml2geojson',
            'banner': banner,
            'outro': outro,
            'extend': true,
            'intro': intro,
            'globals': {
               
            },
            'file': 'dist/gml2geojson.js'
        }
    },
    {
        input: 'src/index.js',
        plugins: basePlugins.concat([terser()]),
        external: [],
        output: {
            'sourcemap': false,
            'format': 'umd',
            'name': 'gml2geojson',
            'banner': banner,
            'outro': outro,
            'extend': true,
            'intro': intro,
            'globals': {
               
            },
            'file': 'dist/gml2geojson.min.js'
        }
    },
    {
        input: 'src/index.js',
        plugins: basePlugins,
        external: [],
        output: {
            'sourcemap': false,
            'format': 'es',
            'name': 'gml2geojson',
            'banner': banner,
            'outro': outro,
            'extend': true,
            'intro': intro,
            'globals': {
               
            },
            'file': 'dist/gml2geojson.es.js'
        }
    },
];