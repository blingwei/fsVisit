
function factory(app, opts){
    async function  check(ctx, next) {
        if(ctx.path === '/visitInfo/' && ctx.headers['type'] === 'scan'){
            return next();
        }

        if(ctx.path !== '/login' && !ctx.session.user){
            throw new Error('未登录')
        }
        await next()
    }
    return check
}

module.exports = factory
