const Sequelize = require('sequelize');


module.exports = function (app, config) {
    //load orm when start.
    //so insert model when start.
    let orm = new Sequelize(config.url, config.opts);
    let dc = {};
    dc.orm = orm;
    dc.ORM = Sequelize;
    dc.models = {};
    //export dc to app global;
    app.fs = app.fs || {};
    app.fs.dc = dc;
    config.models[0](dc);
    app.fs.logger.info('init dc')
    return async function (ctx, next) {
        //wrap orm and ORM
        ctx.fs = ctx.fs || {};
        ctx.fs.dc = dc;
        await next();
    };
};
