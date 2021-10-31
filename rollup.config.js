import path from 'path';
import fs from 'fs';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import url from 'postcss-url';

const componentsDir = path.join(__dirname, '/src/components/');
const buildDir = path.join(__dirname, '/build/');

const components = getComponents();

export default components.map((component) => ({
    input: path.join(componentsDir, component, 'index.js'),
    output: [
        {
            file: path.join(buildDir, component, 'index.js'),
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: path.join(buildDir, component, 'index.es.js'),
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        commonjs(),
        json(),
        postcss({
            plugins: [
                url({
                    url: 'inline',
                    fallback: 'copy',
                }),
            ],
        }),
        terser(),
        copy({
            targets: [
                {src: 'package.json', dest: buildDir},
            ],
        }),
    ],
}));

function getComponents() {
    return fs.readdirSync(componentsDir).filter(
        (fileName) => fs.statSync(
            path.join(componentsDir, fileName),
        ).isDirectory(),
    );
}
