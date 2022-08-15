export interface AppArgs {
    input: string;      // input dir: dir of excel files
    output: string;     // output dir
    csv: boolean;       // export in csv format
    verb: boolean;      // show detail logs
    language: string;   // language sheet config name
    lid: number;        // language item start id
}