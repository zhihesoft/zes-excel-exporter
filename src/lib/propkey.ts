import { Sheet } from "./sheet";
import log4js from "log4js";
import { isEmpty } from "lodash";
import { keyDescStartRow, keyNameStartRow, language_CN, language_HK, language_JP, language_KR, language_RU, language_US, propKeyIgnoreFlag, propKeySplitter } from "./constants";

type PropAttrProc = (attr: string, key: PropKey) => void;

function languageProcessor(attr: string, key: PropKey) {
    key.language = attr;
}

const attrProcessors = new Map<string, PropAttrProc>([
    ["ignore", (_, key) => key.ignore = true],
    ["i", (_, key) => key.ignore = true],
    ["server", (_, key) => key.client = false],
    ["s", (_, key) => key.client = false],
    ["client", (_, key) => key.server = false],
    ["c", (_, key) => key.server = false],
    [language_CN, languageProcessor],
    [language_HK, languageProcessor],
    [language_JP, languageProcessor],
    [language_US, languageProcessor],
    [language_KR, languageProcessor],
    [language_RU, languageProcessor],
]);


export class PropKey {

    static parse(sheet: Sheet): PropKey[] {
        const descs = sheet.rows[keyDescStartRow] as string[];
        const names = sheet.rows[keyNameStartRow] as string[];
        const ret = names.map((name, i) => new PropKey(i, name, descs[i]));
        if (ret.length <= 0) {
            return ret;
        }

        if (ret[0].ignore) { // if id is ignored, ignore the sheet
            return [];
        }

        const lanmap = new Map<string, number>();
        const lans = ret.filter(i => i.isLanguage);
        // write index for each lang
        lans.forEach(i => {
            i.languageIndex = (lanmap.get(i.name) ?? -1) + 1;
            lanmap.set(i.name, i.languageIndex);
        });

        return ret.filter(i => !i.ignore);
    }

    private constructor(
        public index: number,
        public name: string,
        public description: string
    ) {
        this.description = this.description ?? "";
        if (this.description.startsWith(propKeyIgnoreFlag) || isEmpty(this.name)) {
            this.ignore = true;
            return;
        }

        const descs = this.description.split(propKeySplitter);
        if (descs.length <= 0) {
            this.displayName = this.name;
            return;
        }

        this.displayName = descs[0].trim();
        for (let i = 1; i < descs.length; i++) {
            const attr = descs[i].trim().toLowerCase();
            const proc = attrProcessors.get(attr);
            if (!proc) {
                const err = new Error(`prop key parse failed: cannot find a processor of attr (${attr})`);
                logger.error(err.message);
                throw err;
            }
            proc(attr, this);
        }
    }

    displayName = "";   // key display name
    ignore = false;     // ignore key
    server = true;      // server side prop
    client = true;      // client side prop
    language = "";      // language id
    languageIndex = -1; // language index

    /**
     * whether this prop is a language prop
     */
    get isLanguage(): boolean {
        return !isEmpty(this.language);
    }

}

const logger = log4js.getLogger(PropKey.name);
