#! /usr/bin/env node
import 'source-map-support/register';
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { App } from './lib/app';
import { AppArgs } from './lib/app.args';

const args: AppArgs = yargs(hideBin(process.argv))
    .usage("Usage: zes-excel-exporter [options]")
    .option("input", {
        alias: "i",
        demandOption: true,
        describe: "the dir of excel files",
        string: true,
    })
    .option("output", {
        alias: "o",
        default: "./output",
        describe: "the export dir",
        string: true,
    })
    .option("csv", {
        default: false,
        describe: "export data in csv format",
        boolean: true,
    })
    .option("verb", {
        alias: "v",
        default: false,
        describe: "output detail logs",
        boolean: true,
    })
    .option("language", {
        alias: "l",
        default: "language",
        describe: "language config name",
        string: true,
    })
    .option("lid", {
        default: 180000,
        describe: "language item start id",
        number: true,
    })
    .parseSync();

App.run(args);
