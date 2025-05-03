// [GET] /attendance
module.exports.index = async (req, res) => {
    try {
  
      res.render("pages/attendance/index.ejs", {
        pageTitle: "Quản lý chấm công",
      });
    } catch (error) {
      console.log(error);
    }
  };
  