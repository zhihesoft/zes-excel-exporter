import { exit } from "process";
import { AppArgs } from "./app.args";
import { Book } from "./book";
import { languageExport, languageInit } from "./language";
import { checkDir, ensureDir, getExcels, log } from "./util";


export class App {

    static args: AppArgs;

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
        if (!ensureDir(App.args.output)) {
            logger.error(`create ${this.args.output} failed`);
            exit(1);
        }
    }
}

const logger = log(App.name);