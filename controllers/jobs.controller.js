const dbHuman = require("../model/human/index.model");
const dbPayroll = require("../model/payroll/index.model");

// [GET] /jobs
module.exports.index = async (req,res)=>{
    try {
        const positions = await dbHuman.Position.findAll();
        const cleanPositions = positions.map(
          (position) => position.dataValues
        );
    
        res.render("pages/job/index.ejs", {
            pageTitle: "Quản lý chức vụ",
            cleanPositions
        });
      } catch (error) {
        console.log(error);
      }
   
}
// [GET] /jobs/create
module.exports.createJob = async (req,res)=>{
    res.render("pages/job/create.ejs", {
        pageTitle: "Thêm Chức Vụ"
    });
}

// [POST] /jobs/create
module.exports.createJobPost = async (req, res) => {
    try {
        const { positionName } = req.body;
        
        const existPosition = await dbHuman.Position.findOne({
          where: {
            PositionName: positionName,
          },
        });
    
        if (existPosition) {
          req.flash("thatbai", "Chức vụ đã tồn tại!");
          return res.redirect("back");
        }
    
        const newPosition = await dbHuman.Position.create({
          PositionName: positionName,
          CreatedAt: dbHuman.Sequelize.literal("GETDATE()"),
          UpdatedAt: dbHuman.Sequelize.literal("GETDATE()"),
        });
    
        await dbPayroll.Position.create({
          PositionID: newPosition.PositionID,
          PositionName: positionName,
        });
    
        req.flash("thanhcong", "Tạo chức vụ thành công!");
        res.redirect("/jobs");
      } catch (error) {
        console.log(error);
        res.redirect("/jobs/create");
      }
};


// [GET] /jobs/edit/{id}
module.exports.updateJob = async (req,res)=>{
    const positionId = req.params.id;
    try {
      const position = await dbHuman.Position.findOne({
        where: {
          PositionID: positionId,
        },
      });
      
      if (!position) {
        req.flash("thatbai", "Không tìm thấy chức vụ!");
        return res.redirect("/jobs");
      }
  
      res.render("pages/job/update.ejs", {
        pageTitle: "Cập nhật chức vụ",
        position: position.dataValues,
      });
    } catch (error) {
      console.log(error);
      req.flash("thatbai", "Cập nhật chức vụ thất bại!");
      res.redirect("/jobs");
    }
}

// [PATCH] /jobs/edit/{id}
module.exports.updateJobPatch = async (req, res) => {
    
  };
  
// [DELETE] /jobs/delete/:id
module.exports.deleteJob = async (req, res) => {
    const positionId = req.params.id;
  
    try {
      const employeeCount = await dbHuman.Employee.count({
        where: { PositionID: positionId }
      });
  
      if (employeeCount > 0) {
        req.flash("thatbai", `Không thể xóa chức vụ vì đang có ${employeeCount} nhân viên thuộc chức vụ này!`);
        return res.redirect("/jobs");
      }
  
      await dbHuman.Position.destroy({
        where: { PositionID: positionId }
      });
  
      await dbPayroll.Position.destroy({
        where: { PositionID: positionId }
      });
  
      req.flash("thanhcong", "Xóa chức vụ thành công!");
      res.redirect("/jobs");
  
    } catch (error) {
      console.log(error);
      req.flash("thatbai", "Có lỗi xảy ra khi xóa chức vụ!");
      res.redirect("/jobs");
    }
  };
  