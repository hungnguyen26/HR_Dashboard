const { where } = require("sequelize");
const dbHuman = require("../model/human/index.model");
const dbPayroll = require("../model/payroll/index.model");

// [GET] /departments
module.exports.index = async (req,res)=>{

    try {
        const departments = await dbHuman.Department.findAll();
        const cleanDepartments = departments.map(department => department.dataValues);
        console.log(cleanDepartments);
        
        res.render("pages/department/index.ejs", {
            pageTitle: "Quản lý phòng ban",
            cleanDepartments
        });
    } catch (error) {
        console.log(error);
    }
}

// [GET] /departments/create
module.exports.createDepartment = async (req,res)=>{
    res.render("pages/department/create.ejs", {
        pageTitle: "Thêm phòng ban"
    });
}

// [POST] /departments/create
module.exports.createDepartmentPost = async (req,res)=>{
    try {
        
        const { departmentName } = req.body;

        const existDepartmentName = await dbHuman.Department.findOne({
            where: {
                DepartmentName: departmentName
            }
        })
        if(existDepartmentName){
            console.log("đã tồn tại phòng ban");
        }
        
        const newDepartment = await dbHuman.Department.create({
            DepartmentName: departmentName,
            CreatedAt: dbHuman.Sequelize.literal('GETDATE()'),
            UpdatedAt: dbHuman.Sequelize.literal('GETDATE()'),
        })
        
        await dbPayroll.Department.create({
            DepartmentID: newDepartment.DepartmentID,
            DepartmentName: departmentName,
        })
        res.redirect("/departments");
    } catch (error) {
        console.log(error);
        res.redirect("/departments/create");
    }
}
