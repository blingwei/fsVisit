const request = require("superagent");

module.exports = function (models) {
    const Department = models.Department;
    let services = {};


    services.getById = (id) => {
        return Department.findOne({
            where: {
                id: id
            }
        })
    }

    services.getAll = () =>{
        return Department.findAll({
           order: [['id','ASC']]
        })
    }



    return services;
}


