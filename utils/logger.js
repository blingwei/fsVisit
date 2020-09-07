'use strict';
const winston = require('winston');
const fs = require('fs');
const path = require('path');

module.exports = function (app, config) {
    config.level = config.level || 'error';
    config.filename = config.filename || path.join(process.cwd(), "log", "runtime.log");
    let dir = path.dirname(config.filename);
    let logger = {};

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    logger = new winston.createLogger({
        level: config.level,
        format: winston.format.combine(
            // winston.format.colorize({all: true}),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        transports: [
            new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({all: true}),
                    ),
                }
            ),
            new winston.transports.File({
                    filename: config.filename
                }
            )
        ],
        exitOnError: false,
        exceptionHandlers: [
            new winston.transports.File({
                filename: `${dir}/error.log`
            })
        ]
    });

    app.fs = app.fs || {};
    app.fs.logger = logger;
    logger.info('init fs-logger')
    return async function (ctx, next) {
        ctx.fs = ctx.fs || {};
        ctx.fs.logger = logger;
        await next();
    }
};
