import path from "path";
import { exit } from "process";
import { AppArgs } from "./app.args";
import { Book } from "./book";
import { languageExport, languageInit } from "./language";
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
        App.checkArgs(args);
        languageInit(args.lid);
        const books = getExcels(args.input).map(file => new Book(file));
        books.forEach(book => book.export());
        languageExport();
    }

    private static checkArgs(args: AppArgs) {
        App.args = args;
        if (!checkDir(App.args.input)) {
            logger.error(`${this.args.input} not existed`);
            exit(1);
        }

        removeDir(args.output);

        const serverdir = App.serverOutputDir;
        if (!ensureDir(serverdir)) {
            logger.error(`create ${serverdir} failed`);
            exit(1);
        }

        const clientdir = App.clientOutputDir;
        if (!ensureDir(clientdir)) {
            logger.error(`create ${clientdir} failed`);
            exit(1);
        }

        const languagedir = App.languageOutputDir;
        if (!ensureDir(languagedir)) {
            logger.error(`create ${languagedir} failed`);
            exit(1);
        }

    }
}

const logger = log(App.name);