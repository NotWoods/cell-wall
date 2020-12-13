#!/usr/bin/env node
const yargs = require('yargs-parser');
const { pkg } = require('../index');

pkg(yargs(process.argv.slice(2))).catch(console.error);
