
const request = require("superagent");

module.exports = function (models) {
    const User = models.User;
    let services = {

    };


    services.getCurrentUser = (ctx) => {
        let userId = ctx.session.user ? ctx.session.user.userId : -1;
        return  User.findOne({
            where: {
                id: userId
            }
        })
    }

    services.getUseByPhone = (phone) => {
        return  User.findOne({
            where: {
                phone: phone
            }
        })
    }

    services.getUseByDepartmentId = (id) => {
        return  User.findAll({
            where: {
                departmentId: id
            }
        })
    }

    services.getUseById = (id) => {
        return  User.findOne({
            where: {
                id: id
            }
        })
    }

    services.create = (data) => {
        User.create(data)
    }

    services.updateById = (data, id) => {
        User.update(data, {
            where: {
                id: id
            }
        })
    }



    return services;
}
