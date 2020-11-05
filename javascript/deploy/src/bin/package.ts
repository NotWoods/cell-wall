#!/usr/bin/env node
import yargs from 'yargs-parser';
import { pkg } from '../index';

pkg(yargs(process.argv.slice(2)) as any).catch(console.error);
