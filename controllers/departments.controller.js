const { where } = require("sequelize");
const dbHuman = require("../model/human/index.model");
const dbPayroll = require("../model/payroll/index.model");

// [GET] /departments
module.exports.index = async (req, res) => {
  try {
    const departments = await dbHuman.Department.findAll();
    const cleanDepartments = departments.map(
      (department) => department.dataValues
    );

    res.render("pages/department/index.ejs", {
      pageTitle: "Quản lý phòng ban",
      cleanDepartments,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /departments/create
module.exports.createDepartment = async (req, res) => {
  res.render("pages/department/create.ejs", {
    pageTitle: "Thêm phòng ban",
  });
};

// [POST] /departments/create
module.exports.createDepartmentPost = async (req, res) => {
  try {
    const { departmentName } = req.body;

    const existDepartmentName = await dbHuman.Department.findOne({
      where: {
        DepartmentName: departmentName,
      },
    });
    if (existDepartmentName) {
      console.log("đã tồn tại phòng ban");
    }

    const newDepartment = await dbHuman.Department.create({
      DepartmentName: departmentName,
      CreatedAt: dbHuman.Sequelize.literal("GETDATE()"),
      UpdatedAt: dbHuman.Sequelize.literal("GETDATE()"),
    });

    await dbPayroll.Department.create({
      DepartmentID: newDepartment.DepartmentID,
      DepartmentName: departmentName,
    });
    res.redirect("/departments");
  } catch (error) {
    console.log(error);
    res.redirect("/departments/create");
  }
};

// [GET] /departments/edit/{id}
module.exports.updateDepartment = async (req, res) => {
  const departmentId = req.params.id;
  try {
    const department = await dbHuman.Department.findOne({
      where: {
        DepartmentID: departmentId,
      },
    });
    if (!department) {
      req.flash("thatbai", "Không tìm thấy phòng ban!");
      return res.redirect("/departments");
    }
    // console.log(department.dataValues);

    res.render("pages/department/update.ejs", {
      pageTitle: "Cập nhật phòng ban",
      department: department.dataValues,
    });
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Cập nhật phòng ban thất bại!");
    res.redirect("/departments");
  }
};

// [PATCH] /departments/edit/{id}
module.exports.updateDepartmentPatch = async (req, res) => {
  const departmentId = req.params.id;
  try {
    const { departmentName } = req.body;
    const existDepartmentName = await dbHuman.Department.findOne({
      where: {
        DepartmentName: departmentName,
      },
    });
    if (existDepartmentName) {
      req.flash("thatbai", "Phòng ban đã tồn tại!");
      return res.redirect("back");
    }

    await dbHuman.Department.update(
      {
        DepartmentName: departmentName,
        UpdatedAt: dbHuman.Sequelize.literal("GETDATE()"),
      },
      { where: { DepartmentID: departmentId } }
    );

    await dbPayroll.Department.update(
      { DepartmentName: departmentName },
      { where: { DepartmentID: departmentId } }
    );
    req.flash("thanhcong", "Cập nhật phòng ban thành công!");
    res.redirect("/departments");
  } catch (error) {
    console.log(error);
    res.redirect("/departments/create");
  }
};

// [DELETE] /departments/delete/:id
module.exports.deleteDepartment = async (req, res) => {
    const departmentId = req.params.id;
  
    try {
      const employeeCount = await dbHuman.Employee.count({
        where: { DepartmentID: departmentId }
      });
  
      if (employeeCount > 0) {
        req.flash("thatbai", `Không thể xóa phòng ban vì đang có ${employeeCount} nhân viên thuộc phòng ban này!`);
        return res.redirect("/departments");
      }
  
      await dbHuman.Department.destroy({
        where: { DepartmentID: departmentId }
      });
      await dbPayroll.Department.destroy({
        where: { DepartmentID: departmentId }
      });
  
      req.flash("thanhcong", "Xóa phòng ban thành công!");
      res.redirect("/departments");
  
    } catch (error) {
      console.log(error);
      req.flash("thatbai", "Có lỗi xảy ra khi xóa phòng ban!");
      res.redirect("/departments");
    }
  };
  