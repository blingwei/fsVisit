
module.exports = function (models) {
    const Info = models.VisitInfo;
    let services = {};


    services.getInfosByUserId = (userId) => {
        return  Info.findAll({
            where: {
                userId: userId
            }
        })
    }

    services.getInfoById = (id) => {
        return  Info.findOne({
            where: {
                id: id
            }
        })
    }

    services.create = async  (data, options) => {
        return Info.create(data, options);
    }

    services.updateById = async  (data, id, transaction) => {
        await Info.update(data, {
            where: {
                id: id
            },
            transaction
        })
    }



    return services;
}
