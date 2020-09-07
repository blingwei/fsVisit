/**
 * Created by PengLing on 2019/4/1.
 */

'use strict';
/*jslint node:true*/
const path = require('path');
const os = require('os');
const moment = require('moment');
const args = require('args');
const fs = require('fs')

const dev = process.env.NODE_ENV === 'development';
// 启动参数
args.option(['a', 'anxinyun'], '安心云api');
args.option(['p', 'port'], '启动端口');
args.option(['g', 'pg'], 'postgre服务URL');
args.option(['e', 'es'], 'es服务URL');

const flags = args.parse(process.argv);

if (!flags.p || !flags.g) {
    console.log('缺少启动参数，异常退出');
    args.showHelp();
    process.exit(-1);
}

// 线上配置
const product = {
    port: flags.port || 4000,
    mws: [ // 个性化配置
        {
            entry: require('./app').entry, // 初始化router和中间件
            opts: {}
        },

        {
            entry: require('./utils/wechat').entry, //初始化微信小程序相关api
            opts: {
                appid:  'wx681972a17a0f0eaa',
                secret:  '45901f657d3c7d9390cb8d366e0aa0fa',
            }
        },

    ],

    dc: { // postgre数据库相关配置
        url: flags.pg,
        opts: {
            pool: {
                max: 20,
                min: 10,
                idle: 10000
            },
            define: {
                freezeTableName: true, // 固定表名
                timestamps: false // 不含列 "createAt"/"updateAt"/"DeleteAt"
            },
            timezone: '+08:00',
            logging: false
        },
        models: [require('./app').models] // 初始化所有的模型
    },

    logger: { // 日志相关配置
        level: 'info',
        filename: path.join(__dirname, 'log', 'runtime.log'),
        colorize: false,
        maxsize: 1024 * 1024 * 5,
    },

    https: { // https相关配置  （也可通过nginx服务器解决）
        key: fs.readFileSync('./httpskey/4426021_afterwade.top.key'),
        cert: fs.readFileSync('./httpskey/4426021_afterwade.top.pem'),
    }

};

//开发配置
const development = {
    port: product.port,
    mws: product.mws,
    dc: product.dc,
    logger: product.logger,
    https: product.https
};

if (dev) { //开发个性配置
    // logger
    development.logger.filename = path.join(__dirname, 'log', 'development.log');
    development.logger.level = 'debug';
    development.dc.opts.logging = console.log; // 在控制台打印dc的日志
}

module.exports = dev ? development : product;
