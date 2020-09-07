const request = require("superagent");

module.exports = function (app, router, opts) {

    const UserService = require("../../service/user")(app.fs.dc.models)

    router.post('/login', async (ctx, next) => {
        ctx.fs.logger.info("获取该微信用户的手机号")
        let phone = ctx.request.body.phone;
        //.....
        ctx.fs.logger.info("根据手机号查看是否有这个用户的信息")
        let user = await UserService.getUseByPhone(phone);
        if(user) {
            ctx.session.user = user  //记录登录信息
            ctx.body = {
                message: '登录成功'
            }
        }else{
            ctx.body = {
                message: '该用户不存在'
            }
        }

    })

    router.get('/user/departmentId', async (ctx, next) => {

        try {
            ctx.fs.logger.info("获取部门id")
            let id = ctx.query.id;
            //.....
            ctx.fs.logger.info("根据部门id获取用户")
            let users = await UserService.getUseByDepartmentId(id);
            ctx.fs.logger.info("获取成功");
            ctx.status = 200;
            ctx.body = users;
        } catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 500;
            ctx.body = {name: 'GetError', message: '获取信息失败'};
        }



    })








}
