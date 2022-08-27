export const log4jsconf = {
    appenders: {
        console: {
            type: "console",
            layout: {
                type: "pattern",
                pattern: "[%d] [%p] [%c %f{1}:%l:%o] %m"
            }
        },
        common: {
            type: "file",
            filename: "zes-excel-export.log",
            flags: "w",
            layout: {
                type: "pattern",
                pattern: "[%d] [%p] [%c %f{1}:%l:%o] %m"
            }
        }
    },
    categories: {
        default: {
            appenders: [
                "console",
                "common"
            ],
            level: "debug",
            enableCallStack: true
        }
    }
};
