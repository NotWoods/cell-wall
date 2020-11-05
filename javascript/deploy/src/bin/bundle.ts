#!/usr/bin/env node
import yargs from 'yargs-parser';
import { bundle } from '../index';

bundle(yargs(process.argv.slice(2)) as any).catch(console.error);
