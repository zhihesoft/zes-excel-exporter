#! /usr/bin/env node
import 'source-map-support/register';
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { App } from './lib/app';
import { AppArgs } from './lib/app.args';
import log4js from "log4js";

log4js.configure({
    "appenders": {
        "console": {
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "[%d] [%p] [%c %f{1}:%l:%o] %m"
            }
        },
        "common": {
            "type": "file",
            "filename": "zes-excel-export.log",
            "flags": "w",
            "layout": {
                "type": "pattern",
                "pattern": "[%d] [%p] [%c %f{1}:%l:%o] %m"
            }
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "console",
                "common"
            ],
            "level": "debug",
            "enableCallStack": true
        }
    }
});

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
