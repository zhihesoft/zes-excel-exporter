import { getLogger } from "log4js";
import fs from "fs";
import path from "path";

export function log(name: string) {
    return getLogger(name);
}

export function getExcels(dir: string): string[] {
    // init configs
    const ret: string[] = [];
    const files = fs.readdirSync(dir);

    for (const fp of files) {
        const fullpath = path.join(dir, fp);
        const info = fs.statSync(fullpath);
        if (info.isFile()) {
            if (fp.endsWith(".xlsx") && !fp.startsWith("~")) {
                ret.push(fullpath);
            }
        }
    }
    return ret;
}

export function removeDir(dir: string) {
    fs.rmSync(dir, { recursive: true, force: true });
}

export function ensureDir(dir: string): boolean {
    if (!checkDir(dir)) {
        return createDir(dir);
    }
    return true;
}

export function checkDir(dir: string): boolean {
    return fs.existsSync(dir);
}

export function notImplementError(message: string) {
    return new Error(`not implement ${message}`);
}

function createDir(dir: string): boolean {
    try {
        fs.mkdirSync(dir, { recursive: true });
        return true;
    } catch (err) {
        logger.error(`create dir failed: ${err}`);
        return false;
    }
}


const logger = log(`util`);

