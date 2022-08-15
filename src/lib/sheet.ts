import { App } from "./app";
import { languageAdd } from "./language";
import { PropKey } from "./propkey";

export class Sheet {
    constructor(
        public displayName: string,
        public rows: unknown[]
    ) {
        this.name = (rows[0] as string[])[0];
        this.keys = PropKey.parse(this);
    }

    name = "";
    keys: PropKey[] = [];
    ignore = false;

    get idKey(): PropKey {
        return this.keys[0];
    }

    export() {
        if (this.name == App.args.language) {
            this.exportLanguage();
        } else {
            this.exportCommon();
        }
    }

    private exportCommon() {
        //
    }

    private exportLanguage() {
        this.rows.slice(3).forEach(row => {
            const line = row as unknown[];
            const id = line[0] as number;
            this.keys.slice(1).forEach(key => languageAdd(key.name, id, line[key.index] as string));
        });
    }
}