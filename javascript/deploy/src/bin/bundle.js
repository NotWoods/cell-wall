#!/usr/bin/env node
const yargs = require('yargs-parser');
const { bundle } = require('../index');

bundle(yargs(process.argv.slice(2))).catch(console.error);
