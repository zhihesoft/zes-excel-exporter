import { isEmpty, map } from "lodash";
import path from "path";
import { App } from "./app";
import { exportData } from "./exporter";
import { ensureDir, log } from "./util";

let currentLanguageItemId = 0;

class LanguageData {
    [index: number]: string;
}

const languages = new Map<string, LanguageData>();


export function languageInit(startId: number) {
    currentLanguageItemId = startId;
}

export function languageNextId() {
    return currentLanguageItemId++;
}

export function languageAdd(lang: string, id: number, value: string) {
    const data = getLanguageData(lang);
    if (data[id]) {
        const err = new Error(`${lang} id(${id}) already existed. (${lang})`);
        logger.error(err.message);
        throw err;
    }
    data[id] = value;
}

export function languageExport() {
    if (isEmpty(languages)) {
        return;
    }
    const outdir = path.join(App.args.output, "language");
    ensureDir(outdir);
    languages.forEach((lang, key) => {
        const filename = `i18n-${key}`;
        const items = App.args.csv ? map(lang, (v, k) => { return { id: k, value: v } }) : lang;
        exportData(outdir, filename, items);
    });
}

function getLanguageData(lang: string): LanguageData {
    let item = languages.get(lang);
    if (!item) {
        item = {};
        languages.set(lang, item);
    }
    return item;
}

const logger = log(`Language`);
