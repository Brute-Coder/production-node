import { createLogger, format, transports } from "winston"
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports"
import util from "util"
import config from "../config/config"
import { EApplicationEnvirontment } from "../constant/application"
import path from "path"
import * as sourcemapsupport from "source-map-support"

// Enable sourcemaps
sourcemapsupport.install()

const consoleLogFormat = format.printf((info) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { level, message, timestamp, meta = {} } = info
    const customLevel = level.toUpperCase()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const customMessage = message
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const customTimestamp = timestamp
    const customMeta = util.inspect(meta, { showHidden: false, depth: 5 })

    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n ${"META"} ${customMeta}\n`
    return customLog
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (config.ENV === EApplicationEnvirontment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: "info",
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ]
    }
    return []
}

const fileLogFormat = format.printf((info) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { level, message, timestamp, meta = {} } = info

    const logMeta: Record<string, unknown> = {}

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack || ""
            }
        } else {
            logMeta[key] = value
        }
    }
    const logData = {
        level: level.toUpperCase(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})

const FileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, "../", "../", "logs", `${config.ENV}.log`),
            level: "info",
            format: format.combine(format.timestamp(), fileLogFormat)
        })
    ]
}

export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...FileTransport(), ...consoleTransport()]
})

