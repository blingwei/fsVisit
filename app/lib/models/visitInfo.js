module.exports = function (dc) {
    const VisitInfo = dc.orm.define('visitInfo',
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
            organization: {
                field: 'organization',
                type: dc.ORM.STRING,

            },
            phone: {
                field: 'phone',
                type: dc.ORM.STRING,
            },
            reason: {
                field: 'reason',
                type: dc.ORM.STRING,
            },
            num: {
                field: 'num',
                type: dc.ORM.INTEGER,
            },
            date: {
                field: 'date',
                type: dc.ORM.DATE
            },
            licensePlateNumber:{
                field: 'license_plate_number',
                type: dc.ORM.STRING
            },
            departmentId: {
                field: 'department_id',
                type: dc.ORM.INTEGER,
            },
            userId: {
                field: 'user_id',
                type: dc.ORM.INTEGER,
            },
            status: {
                field: 'status',
                type: dc.ORM.INTEGER,
            },
            qrCode: {
                field: 'qr_code',
                type: dc.ORM.BLOB
            },
            createDate: {
                field: 'create_date',
                type: dc.ORM.DATE
            },
        }, {
            tableName: 'visit_info'
        });

    dc.models.VisitInfo = VisitInfo;

    return VisitInfo;
};
