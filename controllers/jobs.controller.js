// [GET] /jobs
module.exports.index = async (req,res)=>{
    res.render("pages/job/index.ejs", {
        pageTitle: "Quản lý chức vụ"
    });
}
// [GET] /jobs/create
module.exports.createJob = async (req,res)=>{
    res.render("pages/job/create.ejs", {
        pageTitle: "Thêm Chức Vụ"
    });
}
