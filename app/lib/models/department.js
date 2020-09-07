module.exports = function (dc) {
    const Department = dc.orm.define('department',
        {
            id: {
                field: 'id',
                type: dc.ORM.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                field: 'name',
                type: dc.ORM.STRING,

            },
            pId: {
                field: 'p_id',
                type: dc.ORM.INTEGER,
            },
        }, {
            tableName: 'department'
        });

    dc.models.Department = Department;

    return Department;
};
