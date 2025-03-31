
// [GET] /home
module.exports.index = async (req,res)=>{
    res.render("pages/home/index.ejs", {
        pageTitle: "Trang chủ"
    });
}