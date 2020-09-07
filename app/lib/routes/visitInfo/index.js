const moment = require('moment');

module.exports = function (app, router, opts) {
    const VisitInfoService = require('../../service/visitInfo')(app.fs.dc.models)
    const UserService = require("../../service/user")(app.fs.dc.models)
    const DepartmentService = require("../../service/department")(app.fs.dc.models)


    router.get('/visitInfos', async (ctx, next) => {
        try {
            ctx.fs.logger.info("获取用户信息")
            let user = ctx.session.user
            ctx.fs.logger.info("获取用户的来访信息")
            let infos = await VisitInfoService.getInfosByUserId(user.id)
            let res = []
            for (let data of infos) {
                let info = data['dataValues'];
                info.qrCode = '';
                let user = await UserService.getUseById(info.userId);
                let department = await DepartmentService.getById(info.departmentId);
                info.username = user.name
                info.departmentName = department.name;
                info.date = new moment(info.date).format('YYYY-MM-DD HH:mm:ss');
                res.push(info)
            }
            ctx.fs.logger.info("获取成功")
            ctx.status = 200;
            ctx.body = res;
        } catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'GetError', message: '获取来访信息失败'};
        }

    })

    router.get('/visitInfo/qrCode', async (ctx, next) => {
        let id =  ctx.query.id
        try{
            ctx.fs.logger.info("获取二维码信息")
            let info = await VisitInfoService.getInfoById(id)
            ctx.fs.logger.info("获取成功")
            ctx.status = 200;
            ctx.body = info.qrCode;
        }catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'GetError', message: '获取二维码信息失败'};
        }
    })

    router.get('/visitInfo', async (ctx, next) => {
        let id = ctx.query.id
        try {
            ctx.fs.logger.info("获取来访信息")
            let info = await VisitInfoService.getInfoById(id)
            // 校验时间，判断是否过期
            let user = await UserService.getUseById(info.userId);
            let department = await DepartmentService.getById(info.departmentId)
            let res = info['dataValues']
            res.username = user ? user.name : '错误用户'
            res.departmentName = department ?  department.name : '错误部门';
            res.qrCode = ''
            res.date = moment(res.date).format('YYYY-MM-DD HH');
            ctx.fs.logger.info("判断是否过期");
            res.status = true;
            let time = moment().diff(moment(res.date),'hour');
            if(time > 24){
                res.status = false;
            }
            ctx.fs.logger.info("获取成功");
            ctx.status = 200;
            ctx.body = res;
        } catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'GetError', message: '获取来访信息失败'};
        }

    })

    router.post('/visitInfo', async (ctx, next) => {
        let data = ctx.request.body;
        const transaction = await ctx.fs.dc.orm.transaction();
        try {
            ctx.fs.logger.info("获取用户信息")
            const info = {
                name: data.name,
                phone: data.phone,
                organization: data.organization,
                reason: data.reason,
                num: data.num,
                date: data.date,
                licensePlateNumber: data.licensePlateNumber,
                departmentId: data.departmentId,
                userId: data.userId,
                status: 1,
                createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            ctx.fs.logger.info("新增来访信息")
            const res = await VisitInfoService.create(info, {transaction})

            ctx.fs.logger.info("生成二维码")
            let token = await app.fs.weChat.getAccessToken();
            let buffer = await app.fs.weChat.getQrCode(token, res.id);

            ctx.fs.logger.info("更新来访信息，绑定二维码");
            let updateData = {
                qrCode: buffer
            }
            await VisitInfoService.updateById(updateData, res.id, transaction)

            ctx.fs.logger.info("新增来访信息成功");
            await transaction.commit();
            ctx.status = 200;
            ctx.body = buffer;
        } catch (e) {
            await transaction.rollback();
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'AddError', message: '新增来访信息失败'};
        }

    })


    router.put('/visitInfo', async (ctx, next) => {
        let id = ctx.query.id;
        let status = ctx.query.status
        try {
            ctx.fs.logger.info("更新来访信息")
            let updateData = {
                status: status
            }
            await VisitInfoService.updateById(updateData, id)
        } catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'EditError', message: '更新来访状态失败'};
        }

    })

    router.get('/departments', async (ctx, next) => {
        try {
            ctx.fs.logger.info("获取部门信息")
            let departments = await DepartmentService.getAll()
            let res = departments.filter(department =>{
                return department.pId !== -1
            })
            ctx.fs.logger.info("获取成功");
            ctx.status = 200;
            ctx.body = res;
        } catch (e) {
            ctx.fs.logger.error(`path: ${ctx.path}, error: ${e}`);
            ctx.status = 400;
            ctx.body = {name: 'GetError', message: '获取信息失败'};
        }

    })



}
