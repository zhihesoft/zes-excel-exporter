import fs from "fs";
import path from "path";
import { App } from "./app";
import { format } from "fast-csv";

export function exportData(dir: string, filename: string, data: unknown) {
    if (App.args.csv) {
        exportCsvData(dir, filename, data);
    } else {
        exportJsonData(dir, filename, data);
    }
}

function exportCsvData(dir: string, filename: string, data: unknown) {
    const filepath = path.join(dir, `${filename}.csv`);
    const stream = format({ headers: true });
    const ws = fs.createWriteStream(filepath, { encoding: "utf-8" });
    stream.pipe(ws);
    (data as unknown[]).forEach(i => stream.write(i));
    // stream.write(data);
    ws.close();
}

function exportJsonData(dir: string, filename: string, data: unknown) {
    const json = JSON.stringify(data, null, 4);
    const filepath = path.join(dir, `${filename}.json`);
    fs.writeFileSync(filepath, json, { encoding: "utf-8" });
}