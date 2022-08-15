import xlsx from "node-xlsx";
import path from "path";
import { sheetIgnoreFlag } from "./constants";
import { Sheet } from "./sheet";
import { log } from "./util";

export class Book {
    constructor(
        public filepath: string
    ) {
        this.name = path.parse(this.filepath).name;
    }

    readonly name: string;

    export() {
        const raw = xlsx.parse(this.filepath);
        if (!raw) {
            logger.error(`Parse ${this.filepath} failed!`);
            return false;
        }

        raw.filter(s => !s.name.startsWith(sheetIgnoreFlag))
            .map(i => new Sheet(i.name, i.data))
            .filter(i => !i.ignore)
            .forEach(i => i.export(this.name));
    }
}

const logger = log(Book.name);