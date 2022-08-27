import { App } from "./app";
import { exportData } from "./exporter";
import { languageAdd, languageNextId } from "./language";
import { PropKey } from "./propkey";
import { log } from "./util";

export class Sheet {
    constructor(
        public displayName: string,
        public rows: unknown[]
    ) {
        this.name = (rows[0] as string[])[0];
        this.keys = PropKey.parse(this);
        if (!this.idKey || this.idKey.ignore || !this.name || this.name.length <= 0) {
            this.ignore = true;
        }
    }

    name = "";
    keys: PropKey[] = [];
    ignore = false;

    get idKey(): PropKey {
        return this.keys[0];
    }

    export(bookname: string) {
        if (this.name == App.args.language) {
            this.exportLanguage();
        } else {
            logger.info(`[${bookname}].${this.displayName} => ${this.name}`);
            this.exportCommon();
        }
    }

    private exportCommon() {
        this.rows.slice(3).forEach(i => this.exportLangInLine(i as unknown[]));
        const serveritems = this.rows.slice(3).map(i => this.exportItem(i as unknown[], (key) => key && key.server)).filter(i => i);
        const clientitems = this.rows.slice(3).map(i => this.exportItem(i as unknown[], (key) => key && key.client)).filter(i => i);
        exportData(App.serverOutputDir, this.name, serveritems);
        exportData(App.clientOutputDir, this.name, clientitems);
    }

    private exportItem(line: unknown[], condition: (key: PropKey) => boolean) {
        if (!condition(this.idKey)) {
            return undefined;
        }
        const ret: { [index: string]: unknown } = {};
        for (const key of this.keys) {
            if (!condition(key)) {
                continue;
            }
            if (key.isLanguage && key.languageIndex > 0) {
                continue;
            }
            ret[key.name] = line[key.index];
        }
        return ret;
    }

    private exportLangInLine(line: unknown[]) {
        this.keys.filter(i => i.language).filter(i => i.languageIndex == 0).forEach(lang => {
            const langid = languageNextId();
            // logger.debug(`lang keys: ${JSON.stringify(this.keys.filter(i => i.name == lang.name), null, 4)}`);
            this.keys.filter(i => i.name == lang.name).forEach(i => languageAdd(i.language, langid, line[i.index] as string));
            line[lang.index] = langid;
        });
    }

    private exportLanguage() {
        this.rows.slice(3).forEach(row => {
            const line = row as unknown[];
            const id = line[0] as number;
            this.keys.slice(1).forEach(key => languageAdd(key.name, id, line[key.index] as string));
        });
    }
}

const logger = log(Sheet.name);
