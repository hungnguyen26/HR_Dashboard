
module.exports.index = async (req,res)=>{
    res.render("pages/reports/index.ejs", {
        pageTitle: "Báo cáo & Phân tích"
    });
}