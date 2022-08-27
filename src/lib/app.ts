import log4js from "log4js";
import path from "path";
import { exit } from "process";
import { AppArgs } from "./app.args";
import { Book } from "./book";
import { languageExport, languageInit } from "./language";
import { log4jsconf } from "./log4js.conf";
import { checkDir, ensureDir, getExcels, log, removeDir } from "./util";


export class App {

    static args: AppArgs;

    static get serverOutputDir() {
        return path.join(App.args.output, "server");
    }

    static get clientOutputDir() {
        return path.join(App.args.output, "client");
    }

    static get languageOutputDir() {
        return path.join(App.args.output, "language");
    }

    static async run(args: AppArgs) {

        log4js.configure(log4jsconf);

        if (App.checkArgs(args)) {
            languageInit(args.lid);
            const books = getExcels(args.input).map(file => new Book(file));
            books.forEach(book => book.export());
            languageExport();
        }
        log4js.shutdown();
    }

    private static checkArgs(args: AppArgs): boolean {
        App.args = args;
        if (!checkDir(App.args.input)) {
            logger.error(`${this.args.input} not existed`);
            return false;
        }

        removeDir(args.output);

        const serverdir = App.serverOutputDir;
        if (!ensureDir(serverdir)) {
            logger.error(`create ${serverdir} failed`);
            return false;
        }

        const clientdir = App.clientOutputDir;
        if (!ensureDir(clientdir)) {
            logger.error(`create ${clientdir} failed`);
            return false;
        }

        const languagedir = App.languageOutputDir;
        if (!ensureDir(languagedir)) {
            logger.error(`create ${languagedir} failed`);
            return false;
        }

        return true;
    }
}

const logger = log(App.name);