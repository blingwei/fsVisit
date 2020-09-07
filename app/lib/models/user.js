module.exports = function (dc) {
    const User = dc.orm.define('user',
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
            phone: {
                field: 'phone',
                type: dc.ORM.STRING,
            },
            departmentId: {
                field: 'department_id',
                type: dc.ORM.INTEGER,
            },
        }, {
            tableName: 'user_info'
        });

    dc.models.User = User;

    return User;
};
