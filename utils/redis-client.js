
const Redis = require("redis");

module.exports = {

    entry: function (app, router, opts) {
        const client =  Redis.createClient(opts);
        app.fs = app.fs || {};
        app.fs.redisClient = client;

        app.fs.logger.log('info', 'init redisClient and inject it into app(app.fs.redisClient)');
    }
};
