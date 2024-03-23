

//[GET] /home
module.exports.index = async (req, res) => {
  try {
    res.render("client/pages/home/index.pug", {
      pageTitle: "Trang chủ"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang chủ");
    res.redirect("back");
  }
}